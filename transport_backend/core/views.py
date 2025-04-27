# views.py
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
from django.http import HttpResponseRedirect

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



class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve", "get_by_reference"]:
            return BookingDetailSerializer
        elif self.action in ["create"]:
            return BookingCreateSerializer
        return BookingSerializer  # Use BookingSerializer for update and partial_update

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
                booking.status in ["confirmed", "pending"] and
                booking.trip and
                booking.trip.departure_datetime < now
            ):
                booking.status = "completed"
                booking.save(update_fields=["status"])

        return bookings

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
        if origin_id:
            queryset = queryset.filter(route__origin_park_id=origin_id)
        if destination_id:
            queryset = queryset.filter(route__destination_park_id=destination_id)
        if travel_date:
            queryset = queryset.filter(departure_datetime__date=travel_date)

        print("Queryset after filtering:", queryset)  # Debugging line
        return queryset


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
            trips = Trip.objects.filter(route__origin_park=park)
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
        if not trips_data:
            return Response({"error": "No trips data provided."}, status=status.HTTP_400_BAD_REQUEST)

        created_trips = []
        errors = []

        for trip_data in trips_data:
            serializer = TripSerializer(data=trip_data)
            if serializer.is_valid():
                # Check for ±2 hour bus conflict
                departure_datetime = serializer.validated_data['departure_datetime']
                bus = serializer.validated_data['bus']

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
                    errors.append(f"Bus {bus.number_plate} already has a trip near {departure_datetime}.")
                    continue

                created_trip = serializer.save()
                created_trips.append(created_trip)
            else:
                errors.append(serializer.errors)

        if created_trips:
            response_data = TripListSerializer(created_trips, many=True).data
            return Response({"created_trips": response_data, "errors": errors}, status=status.HTTP_201_CREATED)
        else:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

class TripDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, trip_id):
        try:
            trip = Trip.objects.get(id=trip_id)
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check park admin ownership
        if request.user.role == 'park_admin' and trip.route.origin_park.admin != request.user:
            return Response({"error": "You do not have permission to delete this trip."}, status=status.HTTP_403_FORBIDDEN)

        # Check if trip has bookings
        if trip.bookings.exists():
            return Response({"error": "Cannot delete a trip that has bookings."}, status=status.HTTP_400_BAD_REQUEST)

        trip.delete()
        return Response({"message": "Trip deleted successfully."}, status=status.HTTP_200_OK)


# New Payment-Related Views
class InitializePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentInitializationSerializer(data=request.data)
        if serializer.is_valid():
            booking = get_object_or_404(Booking, id=serializer.validated_data['booking_id'], user=request.user)
            
            if booking.payment_status != 'pending':
                return Response({'error': 'Payment already processed or invalid.'}, status=status.HTTP_400_BAD_REQUEST)
            
            url = 'https://api.paystack.co/transaction/initialize'
            headers = {
                'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
                'Content-Type': 'application/json',
            }
            data = {
                'email': booking.user.email,
                'amount': int(booking.price * 100),  # Paystack expects amount in kobo (NGN)
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
                    booking.payment_status = 'failed'
                    booking.status = 'cancelled'
                    booking.save()
                    return Response({'error': 'Failed to initialize payment.'}, status=status.HTTP_400_BAD_REQUEST)
            except requests.RequestException as e:
                booking.payment_status = 'failed'
                booking.status = 'cancelled'
                booking.save()
                return Response({'error': f'Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            
            if response_data['status'] and response_data['data']['status'] == 'success':
                booking.payment_status = 'completed'
                booking.status = 'confirmed'
                booking.save()
                frontend_url = f'http://localhost:5173/travel-history'
                return HttpResponseRedirect(frontend_url)
                # return Response({
                #     'message': 'Payment successful',
                #     'booking': BookingDetailSerializer(booking).data
                # }, status=status.HTTP_200_OK)
            else:
                booking.payment_status = 'failed'
                booking.status = 'cancelled'
                booking.save()
                return Response({
                    'error': 'Payment failed',
                    'booking': BookingDetailSerializer(booking).data
                }, status=status.HTTP_400_BAD_REQUEST)
        except requests.RequestException as e:
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
            if booking.payment_status != 'completed':  # Idempotency check
                booking.payment_status = 'completed'
                booking.status = 'confirmed'
                booking.save()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        return Response({'status': 'ignored'}, status=status.HTTP_200_OK)
    
    
    
    
    
    
