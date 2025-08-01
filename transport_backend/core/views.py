
from datetime import datetime
from rest_framework.views import APIView
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import requests
import json
from django.db.models import Q
from django.http import HttpResponseRedirect
from django.db import transaction
import logging


logger = logging.getLogger(__name__)

from .models import *
from .serializers import (
    CitySerializer, BusParkSerializer, RouteSerializer, BookingCreateSerializer,
    TripSerializer, TripListSerializer, IndirectRouteSerializer, BookingDetailSerializer,
    BusSerializer, PaymentInitializationSerializer, BookingSerializer
)


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [permissions.AllowAny]


class BusParkViewSet(viewsets.ModelViewSet):
    queryset = BusPark.objects.all()
    serializer_class = BusParkSerializer
    permission_classes = [permissions.AllowAny]


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'park_admin':
            return Route.objects.filter(origin_park__admin=self.request.user, status="active")
        return Route.objects.all()



# bus_booking/views.py

class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve", "get_by_reference"]:
            return BookingDetailSerializer
        elif self.action in ["create"]:
            return BookingCreateSerializer
        return BookingSerializer

    @action(detail=False, methods=["get"], url_path=r"ref/(?P<ref>[A-Za-z0-9\-]+)")
    def get_by_reference(self, request, ref=None):
        try:
            booking = Booking.objects.get(payment_reference=ref, user=request.user)
            serializer = BookingDetailSerializer(booking)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response(
                {"detail": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    def get_queryset(self):
        bookings = Booking.objects.filter(user=self.request.user)

        # Auto-update expired bookings to "completed"
        now = timezone.now()
        for booking in bookings:
            if (
                booking.status in ["confirmed", "pending"]
                and booking.trip
                and booking.trip.departure_datetime < now
            ):
                booking.status = "completed"
                booking.save(update_fields=["status"])
        return bookings

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        with transaction.atomic():
            trip = Trip.objects.select_for_update().get(id=instance.trip.id)
            if serializer.validated_data.get("status") == "cancelled" and instance.status != "cancelled":
                # Release seats and update available_seats
                if instance.payment_status in ["successful", "pending"]:
                    trip.available_seats += instance.seat_count
                    instance.seat_assignments.all().delete()  # Delete seat assignments
                    trip.save()
            serializer.save()

class TripSearchAPIView(ListAPIView):
    serializer_class = TripListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        origin_id = self.request.query_params.get('origin_id')
        destination_id = self.request.query_params.get('destination_id')
        travel_date = self.request.query_params.get('date')

        queryset = Trip.objects.all()
        print("Initial queryset:", queryset)  # Debugging line
        print("Origin ID:", origin_id)  # Debugging line
        print("Destination ID:", destination_id)  # Debugging line
        print("Travel Date:", travel_date)  # Debugging line

        # Apply origin and destination filters
        if origin_id:
            queryset = queryset.filter(route__origin_park_id=origin_id)
        if destination_id:
            queryset = queryset.filter(route__destination_park_id=destination_id)

        # Apply date and time filters
        if travel_date:
            try:
                # Parse the travel_date (assuming format like '2025-04-30')
                travel_date_obj = datetime.strptime(travel_date, '%Y-%m-%d').date()
                today = timezone.now().date()

                if travel_date_obj == today:
                    # For today, only include trips with departure time >= now
                    queryset = queryset.filter(
                        Q(departure_datetime__date=travel_date_obj) &
                        Q(departure_datetime__gte=timezone.now())
                    )
                else:
                    # For future dates, include all trips on that date
                    queryset = queryset.filter(departure_datetime__date=travel_date_obj)
            except ValueError:
                # Handle invalid date format
                print(f"Invalid date format for travel_date: {travel_date}")
                queryset = queryset.none()  # Return empty queryset for invalid date

        print("Queryset after filtering:", queryset)  # Debugging line
        return queryset.order_by('departure_datetime')


class BookingCreateAPIView(CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        response_data = BookingDetailSerializer(booking).data
        return Response({
            'message': 'Booking created successfully',
            'booking': response_data,
            'payment_url': '/api/payment/initialize/'
        }, status=status.HTTP_201_CREATED)


class IsParkAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'park_admin'


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'park_admin':
            return Trip.objects.filter(route__origin_park__admin=self.request.user)
        return self.queryset

    def perform_create(self, serializer):
        if self.request.user.role == 'park_admin':
            route = serializer.validated_data['route']
            if route.origin_park.admin != self.request.user:
                raise permissions.PermissionDenied("You can only create trips for your park.")
        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.role == 'park_admin':
            trip = self.get_object()
            if trip.route.origin_park.admin != self.request.user:
                raise permissions.PermissionDenied("You can only update trips for your park.")
        serializer.save()


class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'park_admin':
            return Bus.objects.filter(park__admin=self.request.user)
        park_id = self.request.query_params.get('park', None)
        if park_id:
            return Bus.objects.filter(park_id=park_id)
        return self.queryset


class ParkBusesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, park_id):
        try:
            park = BusPark.objects.get(id=park_id, admin=request.user)
            buses = park.buses.filter(status="available")
            serializer = BusSerializer(buses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BusPark.DoesNotExist:
            return Response(
                {"error": "Park not found or you do not have access."},
                status=status.HTTP_404_NOT_FOUND
            )


class ParkRoutesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, park_id):
        try:
            park = BusPark.objects.get(id=park_id, admin=request.user)
            routes = park.routes_from.filter(status="active")
            serializer = RouteSerializer(routes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BusPark.DoesNotExist:
            return Response(
                {"error": "Park not found or you do not have access."},
                status=status.HTTP_404_NOT_FOUND
            )


class ParkTripsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, park_id):
        try:
            park = BusPark.objects.get(id=park_id, admin=request.user)
            now = timezone.now()
            trips = Trip.objects.filter(
                route__origin_park=park,
                departure_datetime__gte=now  # Only show trips that are today or in future
            ).order_by('departure_datetime')
            serializer = TripListSerializer(trips, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BusPark.DoesNotExist:
            return Response(
                {"error": "Park not found or you do not have access."},
                status=status.HTTP_404_NOT_FOUND
            )



class TripCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, park_id):
        try:
            park = BusPark.objects.get(id=park_id, admin=request.user)
        except BusPark.DoesNotExist:
            return Response(
                {"error": "Park not found or you do not have access."},
                status=status.HTTP_404_NOT_FOUND
            )

        trips_data = request.data.get('trips', [])
        if not isinstance(trips_data, list):
            return Response({"error": "Trips data must be a list."}, status=status.HTTP_400_BAD_REQUEST)
        if not trips_data:
            return Response({"error": "No trips data provided."}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"Received trips data: {trips_data}")

        created_trips = []
        errors = []

        with transaction.atomic():
            for index, trip_data in enumerate(trips_data):
                serializer = TripSerializer(data=trip_data)
                if serializer.is_valid():
                    bus = serializer.validated_data['bus']
                    departure_datetime = serializer.validated_data['departure_datetime']

                    # Ensure bus belongs to the park
                    if bus.park != park:
                        errors.append({"trip_index": index, "error": f"Bus {bus.number_plate} does not belong to the specified park."})
                        continue

                    # Check for ±2 hour bus conflict
                    bus_conflict = Trip.objects.filter(
                        bus=bus,
                        departure_datetime__date=departure_datetime.date()
                    ).filter(
                        departure_datetime__range=[
                            departure_datetime - timezone.timedelta(hours=2),
                            departure_datetime + timezone.timedelta(hours=2)
                        ]
                    ).exists()

                    if bus_conflict:
                        logger.warning(f"Bus conflict for bus {bus.number_plate} at {departure_datetime}")
                        errors.append({"trip_index": index, "error": f"Bus {bus.number_plate} already has a trip near {departure_datetime}."})
                        continue

                    created_trip = serializer.save()
                    created_trips.append(created_trip)
                else:
                    logger.error(f"Validation error for trip {index}: {serializer.errors}")
                    errors.append({"trip_index": index, "errors": serializer.errors})

        if created_trips:
            response_data = TripListSerializer(created_trips, many=True).data
            return Response(
                {"created_trips": response_data, "errors": errors},
                status=status.HTTP_207_MULTI_STATUS if errors else status.HTTP_201_CREATED
            )
        else:
            return Response({"errors": {"Please check if  the inputs are not clashing with available trips"}}, status=status.HTTP_400_BAD_REQUEST)




class TripDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, trip_id):
        try:
            trip = Trip.objects.get(id=trip_id)
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found."}, status=status.HTTP_404_NOT_FOUND)

        active_bookings = trip.bookings.filter(status__in=["pending", "confirmed"])

        if active_bookings.exists():
            return Response({"error": "Cannot delete trip with existing bookings."}, status=status.HTTP_400_BAD_REQUEST)

        trip.delete()
        return Response({"message": "Trip deleted successfully."}, status=status.HTTP_200_OK)

class TripUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, trip_id):
        try:
            trip = Trip.objects.get(id=trip_id)
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role == "park_admin" and trip.route.origin_park.admin != request.user:
            return Response({"error": "You do not have permission to update this trip."}, status=status.HTTP_403_FORBIDDEN)

        serializer = TripSerializer(trip, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Trip updated successfully."}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# New Payment-Related Views
# bus_booking/views.py

class InitializePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentInitializationSerializer(data=request.data)
        if serializer.is_valid():
            booking = get_object_or_404(Booking, id=serializer.validated_data['booking_id'], user=request.user)
            
            if booking.payment_status != 'pending':
                return Response({'error': 'Payment already processed or invalid.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify seat assignments
            with transaction.atomic():
                trip = Trip.objects.select_for_update().get(id=booking.trip.id)
                seat_assignments = booking.seat_assignments.values_list('seat_number', flat=True)
                conflicting_seats = SeatAssignment.objects.filter(
                    trip=trip,
                    seat_number__in=seat_assignments
                ).exclude(booking=booking).values_list('seat_number', flat=True)
                if conflicting_seats:
                    booking.payment_status = 'failed'
                    booking.status = 'cancelled'
                    booking.seat_assignments.delete()
                    trip.available_seats += booking.seat_count
                    trip.save()
                    return Response(
                        {'error': f'Seats {list(conflicting_seats)} are no longer available.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            url = 'https://api.paystack.co/transaction/initialize'
            headers = {
                'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
                'Content-Type': 'application/json',
            }
            data = {
                'email': booking.user.email,
                'amount': int(booking.price * 100),
                'reference': booking.payment_reference,
                'callback_url': request.build_absolute_uri('/api/payment/callback/'),
                'metadata': {
                    'booking_id': booking.id,
                    'user_id': booking.user.id,
                }
            }
            
            try:
                response = requests.post(url, headers=headers, json=data)
                response_data = response.json()
                
                if response_data['status'] and response_data['data']['authorization_url']:
                    return Response({
                        'authorization_url': response_data['data']['authorization_url'],
                        'reference': booking.payment_reference
                    }, status=status.HTTP_200_OK)
                else:
                    with transaction.atomic():
                        booking.payment_status = 'failed'
                        booking.status = 'cancelled'
                        booking.seat_assignments.delete()
                        trip = Trip.objects.select_for_update().get(id=booking.trip.id)
                        trip.available_seats += booking.seat_count
                        trip.save()
                    return Response({'error': 'Failed to initialize payment.'}, status=status.HTTP_400_BAD_REQUEST)
            except requests.RequestException as e:
                with transaction.atomic():
                    booking.payment_status = 'failed'
                    booking.status = 'cancelled'
                    booking.seat_assignments.delete()
                    trip = Trip.objects.select_for_update().get(id=booking.trip.id)
                    trip.available_seats += booking.seat_count
                    trip.save()
                return Response({'error': f'Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# bus_booking/views.py

class PaymentCallbackView(APIView):
    def get(self, request):
        reference = request.query_params.get('reference')
        if not reference:
            return Response({'error': 'No reference provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
        url = f'https://api.paystack.co/transaction/verify/{reference}'
        headers = {
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
            'Content-Type': 'application/json',
        }
        
        try:
            response = requests.get(url, headers=headers)
            response_data = response.json()
            
            booking = get_object_or_404(Booking, payment_reference=reference)
            
            with transaction.atomic():
                trip = Trip.objects.select_for_update().get(id=booking.trip.id)
                if response_data['status'] and response_data['data']['status'] == 'success':
                    booking.payment_status = 'successful'
                    booking.status = 'confirmed'
                    booking.save()
                    frontend_url = f'https://flexiryde.vercel.app/travel-history'
                    return HttpResponseRedirect(frontend_url)
                else:
                    booking.payment_status = 'failed'
                    booking.status = 'cancelled'
                    booking.seat_assignments.delete()
                    trip.available_seats += booking.seat_count
                    trip.save()
                    return Response({
                        'error': 'Payment failed',
                        'booking': BookingDetailSerializer(booking).data
                    }, status=status.HTTP_400_BAD_REQUEST)
        except requests.RequestException as e:
            with transaction.atomic():
                booking = get_object_or_404(Booking, payment_reference=reference)
                booking.payment_status = 'failed'
                booking.status = 'cancelled'
                booking.seat_assignments.delete()
                trip = Trip.objects.select_for_update().get(id=booking.trip.id)
                trip.available_seats += booking.seat_count
                trip.save()
            return Response({'error': f'Verification error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class PaystackWebhookView(APIView):
    def post(self, request):
        payload = json.loads(request.body)
        paystack_signature = request.headers.get('x-paystack-signature')
        
        # TODO: Implement HMAC signature verification (see Paystack docs)
        if payload['event'] == 'charge.success':
            reference = payload['data']['reference']
            booking = get_object_or_404(Booking, payment_reference=reference)
            if booking.payment_status != 'successful':  # Idempotency check
                booking.payment_status = 'successful'
                booking.status = 'confirmed'
                booking.save()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        return Response({'status': 'ignored'}, status=status.HTTP_200_OK)
    
    
    
    
    
    
