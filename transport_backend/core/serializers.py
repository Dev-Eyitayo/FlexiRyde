from rest_framework import serializers
from .models import City, BusPark, Route, IndirectRoute, Booking

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


class BookingSerializer(serializers.ModelSerializer):
    origin_park = BusParkSerializer(read_only=True)
    origin_park_id = serializers.PrimaryKeyRelatedField(
        queryset=BusPark.objects.all(), source='origin_park', write_only=True
    )
    destination_city = CitySerializer(read_only=True)
    destination_city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='destination_city', write_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id', 'origin_park', 'origin_park_id',
            'destination_city', 'destination_city_id',
            'travel_date', 'price', 'status', 'created_at'
        ]
        read_only_fields = ['price', 'status', 'created_at']
