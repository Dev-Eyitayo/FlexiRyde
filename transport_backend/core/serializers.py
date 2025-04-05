from rest_framework import serializers
from .models import City, BusPark, Route, IndirectRoute, Booking, Trip, Seat, SeatReservation

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class BusParkSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='city', write_only=True
    )

    class Meta:
        model = BusPark
        fields = ['id', 'name', 'latitude', 'longitude', 'city', 'city_id']


class RouteSerializer(serializers.ModelSerializer):
    origin_park = BusParkSerializer(read_only=True)
    origin_park_id = serializers.PrimaryKeyRelatedField(
        queryset=BusPark.objects.all(), source='origin_park', write_only=True
    )
    destination_city = CitySerializer(read_only=True)
    destination_city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='destination_city', write_only=True
    )

    class Meta:
        model = Route
        fields = ['id', 'origin_park', 'origin_park_id', 'destination_city', 'destination_city_id', 'distance_km']


class IndirectRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndirectRoute
        fields = '__all__'

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ['id', 'seat_number', 'row', 'column']


class SeatReservationSerializer(serializers.ModelSerializer):
    seat = SeatSerializer()

    class Meta:
        model = SeatReservation
        fields = ['id', 'seat', 'trip']

class TripSerializer(serializers.ModelSerializer):
    route = RouteSerializer()
    bus = BusParkSerializer()

    class Meta:
        model = Trip
        fields = ['id', 'route', 'bus', 'travel_date']


class BookingSerializer(serializers.ModelSerializer):
    origin_park = BusParkSerializer(read_only=True)
    destination_city = CitySerializer(read_only=True)
    reserved_seat_ids = serializers.ListField(write_only=True, child=serializers.IntegerField(), required=False)
    trip_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'origin_park', 'origin_park_id',
            'destination_city', 'destination_city_id',
            'travel_date',
            'price', 'status', 'created_at',
            'trip_id', 'reserved_seat_ids'
        ]
        read_only_fields = ['status', 'created_at']

    def create(self, validated_data):
        seat_ids = validated_data.pop('reserved_seat_ids', [])
        trip_id = validated_data.pop('trip_id')
        user = self.context['request'].user

        trip = Trip.objects.get(id=trip_id)
        booking = Booking.objects.create(
            user=user,
            trip=trip,
            price=validated_data['price'],
            status='confirmed',
        )

        for seat_id in seat_ids:
            seat = Seat.objects.get(id=seat_id)
            SeatReservation.objects.create(trip=trip, seat=seat, booking=booking)

        return booking


class TripListSerializer(serializers.ModelSerializer):
    origin_park = serializers.CharField(source='route.origin_park.name')
    destination_city = serializers.CharField(source='route.destination_city.name')
    bus_plate = serializers.CharField(source='bus.number_plate')

    class Meta:
        model = Trip
        fields = ['id', 'origin_park', 'destination_city', 'travel_date', 'departure_time', 'seat_price', 'bus_plate']
