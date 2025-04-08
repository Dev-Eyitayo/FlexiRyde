from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView

from .models import City, BusPark, Route, IndirectRoute, Booking, Trip, Bus
from .serializers import (
    CitySerializer, BusParkSerializer, RouteSerializer, BookingSerializer,
    TripSerializer, TripListSerializer, IndirectRouteSerializer, BookingCreateSerializer, BusSerializer
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


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

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

        if origin_id:
            queryset = queryset.filter(route__origin_park_id=origin_id)
        if destination_id:
            queryset = queryset.filter(route__destination_park_id=destination_id)
        if travel_date:
            queryset = queryset.filter(travel_date=travel_date)

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




# Add this custom permission class (if not already present)
class IsParkAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'park_admin'

# Update your existing TripViewSet
class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]  # Update to IsAuthenticated

    def get_queryset(self):
        # Add this to restrict park admins to their own park's trips
        if self.request.user.role == 'park_admin':
            return Trip.objects.filter(route__origin_park__admin=self.request.user)
        return self.queryset

    def perform_create(self, serializer):
        # Add this to ensure park admins only create trips for their park
        if self.request.user.role == 'park_admin':
            route = serializer.validated_data['route']
            if route.origin_park.admin != self.request.user:
                raise permissions.PermissionDenied("You can only create trips for your park.")
        serializer.save()

    # Your existing seat_availability action remains unchanged
    @action(detail=True, methods=['get'], url_path='seats')
    def seat_availability(self, request, pk=None):
        trip = self.get_object()
        total_seats = trip.bus.total_seats
        booked = trip.bookings.count()
        taken_seat_ids = list(range(1, booked + 1))
        available_seats = list(range(booked + 1, total_seats + 1))
        return Response({"taken_seat_ids": taken_seat_ids, "available_seats": available_seats})

# Add this new ViewSet for buses
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