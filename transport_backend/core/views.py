from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Trip, Seat, SeatReservation
from .serializers import TripListSerializer, SeatSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from .models import City, BusPark, Route, IndirectRoute, Booking
from .serializers import *

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer


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


class TripSeatAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, trip_id):
        try:
            trip = Trip.objects.get(id=trip_id)
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found"}, status=404)

        taken_seats = SeatReservation.objects.filter(trip=trip).values_list('seat_id', flat=True)
        all_seats = Seat.objects.filter(bus=trip.bus)

        return Response({
            "taken_seat_ids": list(taken_seats),
            "available_seats": SeatSerializer(all_seats.exclude(id__in=taken_seats), many=True).data
        })


class TripSearchAPIView(ListAPIView):
    serializer_class = TripListSerializer

    def get_queryset(self):
        origin_id = self.request.query_params.get('origin_id')
        destination_id = self.request.query_params.get('destination_id')
        travel_date = self.request.query_params.get('date')

        queryset = Trip.objects.all()
        if origin_id:
            queryset = queryset.filter(route__origin_park_id=origin_id)
        if destination_id:
            queryset = queryset.filter(route__destination_city_id=destination_id)
        if travel_date:
            queryset = queryset.filter(travel_date=travel_date)

        return queryset


class TripSeatAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, trip_id):
        try:
            trip = Trip.objects.get(id=trip_id)
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found"}, status=404)

        taken_seat_ids = SeatReservation.objects.filter(trip=trip).values_list('seat_id', flat=True)
        all_seats = Seat.objects.filter(bus=trip.bus)

        return Response({
            "taken_seat_ids": list(taken_seat_ids),
            "available_seats": SeatSerializer(all_seats.exclude(id__in=taken_seat_ids), many=True).data
        })
