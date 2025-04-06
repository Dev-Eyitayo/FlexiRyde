from rest_framework import serializers
from .models import City, BusPark, Route, IndirectRoute, Booking, Trip, Bus


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
        fields = ['id', 'name', 'latitude', 'longitude', 'status', 'city', 'city_id']


class RouteSerializer(serializers.ModelSerializer):
    origin_park = BusParkSerializer(read_only=True)
    origin_park_id = serializers.PrimaryKeyRelatedField(
        queryset=BusPark.objects.all(), source='origin_park', write_only=True
    )
    destination_park = BusParkSerializer(read_only=True)
    destination_park_id = serializers.PrimaryKeyRelatedField(
        queryset=BusPark.objects.all(), source='destination_park', write_only=True
    )

    class Meta:
        model = Route
        fields = [
            'id', 'origin_park', 'origin_park_id',
            'destination_park', 'destination_park_id',
            'distance_km', 'estimated_duration_min', 'status'
        ]


class IndirectRouteSerializer(serializers.ModelSerializer):
    start_park = BusParkSerializer(read_only=True)
    start_park_id = serializers.PrimaryKeyRelatedField(
        queryset=BusPark.objects.all(), source='start_park', write_only=True
    )
    transit_city = CitySerializer(read_only=True)
    transit_city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='transit_city', write_only=True
    )
    destination_city = CitySerializer(read_only=True)
    destination_city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='destination_city', write_only=True
    )

    class Meta:
        model = IndirectRoute
        fields = [
            'id', 'start_park', 'start_park_id',
            'transit_city', 'transit_city_id',
            'destination_city', 'destination_city_id',
            'total_distance', 'total_price'
        ]

class TripListSerializer(serializers.ModelSerializer):
    bus = serializers.SerializerMethodField()
    route = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = [
            'id',
            'travel_date',
            'departure_time',
            'seat_price',
            'bus',
            'route',
        ]

    def get_bus(self, obj):
        return {
            "number_plate": obj.bus.number_plate,
            "total_seats": obj.bus.total_seats,
        }

    def get_route(self, obj):
        return {
            "origin_park": {
                "id": obj.route.origin_park.id,
                "name": obj.route.origin_park.name,
            },
            "destination_park": {
                "id": obj.route.destination_park.id,
                "name": obj.route.destination_park.name,
            },
            "distance_km": obj.route.distance_km,
        }



class TripSerializer(serializers.ModelSerializer):
    route = RouteSerializer(read_only=True)
    route_id = serializers.PrimaryKeyRelatedField(
        queryset=Route.objects.all(), source='route', write_only=True
    )
    bus = serializers.StringRelatedField(read_only=True)
    bus_id = serializers.PrimaryKeyRelatedField(
        queryset=Bus.objects.all(), source='bus', write_only=True
    )

    class Meta:
        model = Trip
        fields = [
            'id', 'route', 'route_id',
            'bus', 'bus_id',
            'travel_date', 'departure_time', 'seat_price'
        ]


class BookingSerializer(serializers.ModelSerializer):
    trip = TripSerializer(read_only=True)
    trip_id = serializers.PrimaryKeyRelatedField(
        queryset=Trip.objects.all(), source='trip', write_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'trip', 'trip_id',
            'price', 'payment_reference',
            'status', 'created_at'
        ]
        read_only_fields = ['user', 'status', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        booking = Booking.objects.create(user=user, **validated_data)
        return booking
