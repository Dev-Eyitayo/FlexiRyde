from rest_framework.views import APIView
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework import status
from django.utils import timezone

from .models import *
from .serializers import (
    CitySerializer, BusParkSerializer, RouteSerializer, BookingSerializer,
    TripSerializer, TripListSerializer, IndirectRouteSerializer, BookingCreateSerializer, BusSerializer, 
    BookingDetailSerializer 
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
    def get_serializer_class(self):
        if self.action == "list" or self.action == "retrieve":
            return BookingDetailSerializer
        return BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

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
        serializer.save(user=self.request.user, status='confirmed')


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


# class TripViewSet(viewsets.ModelViewSet):
#     queryset = Trip.objects.all()
#     serializer_class = TripSerializer
#     permission_classes = [permissions.AllowAny]  # or IsAuthenticated

#     @action(detail=True, methods=['get'], url_path='seats')
#     def seat_availability(self, request, pk=None):
#         trip = self.get_object()

#         # Mock logic (replace with real seat tracking if needed)
#         total_seats = trip.bus.total_seats
#         booked = trip.bookings.count()

#         taken_seat_ids = list(range(1, booked + 1))  # fake seat ids
#         available_seats = list(range(booked + 1, total_seats + 1))

#         return Response({
#             "taken_seat_ids": taken_seat_ids,
#             "available_seats": available_seats
#         })

class BookingCreateAPIView(CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        # Use the detailed serializer for the response
        response_data = BookingDetailSerializer(booking).data
        return Response(response_data, status=status.HTTP_201_CREATED)

 


# Add this custom permission class (if not already present)
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

  
# ViewSet for buses
class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter buses by park for park admins
        if self.request.user.role == 'park_admin':
            return Bus.objects.filter(park__admin=self.request.user)
        # Optionally, allow filtering by park_id for all users
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
        
# views.py
class TripCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, park_id):
        print("Incoming request data (POST):", request.data)
        try:
            park = BusPark.objects.get(id=park_id, admin=request.user)
        except BusPark.DoesNotExist:
            return Response(
                {"error": "Park not found or you do not have access."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TripSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print("Trip creation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, park_id):
        print("Incoming request data (PUT):", request.data)
        trip_id = request.data.get('id')
        if not trip_id:
            return Response(
                {"error": "Trip ID is required for updating."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            park = BusPark.objects.get(id=park_id, admin=request.user)
            trip = Trip.objects.get(id=trip_id, route__origin_park=park)
        except BusPark.DoesNotExist:
            return Response(
                {"error": "Park not found or you do not have access."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Trip.DoesNotExist:
            return Response(
                {"error": "Trip not found or you do not have access."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TripSerializer(trip, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        print("Trip update errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)