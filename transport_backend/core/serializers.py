import uuid
from datetime import datetime
from django.utils import timezone
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
    departure_time = serializers.SerializerMethodField()

    def get_bus(self, obj):
        return {"number_plate": obj.bus.number_plate, "total_seats": obj.bus.total_seats}

    def get_route(self, obj):
        return {
            "origin_park": {"id": obj.route.origin_park.id, "name": obj.route.origin_park.name},
            "destination_park": {"id": obj.route.destination_park.id, "name": obj.route.destination_park.name},
            "distance_km": obj.route.distance_km,
        }

    def get_departure_time(self, obj):
        return obj.departure_time.strftime('%I:%M %p') if obj.departure_time else None

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["trip", "price"]

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        # Format today’s date as APR07
        date_str = datetime.now().strftime("%b%d").upper()  # e.g., APR07

        # Generate a short UUID for uniqueness
        unique_part = uuid.uuid4().hex[:8].upper()  # e.g., 45A7E1F2

        # Combine them
        reference = f"REF-{date_str}-{unique_part}"

        booking = Booking.objects.create(
            user=user,
            trip=validated_data["trip"],
            price=validated_data["price"],
            payment_reference=reference,
            status="Pending"  # default status
        )

        return booking
    

class BusSerializer(serializers.ModelSerializer):
    park = BusParkSerializer(read_only=True)
    park_id = serializers.PrimaryKeyRelatedField(
        queryset=BusPark.objects.all(), source='park', write_only=True
    )

    class Meta:
        model = Bus
        fields = ['id', 'number_plate', 'total_seats', 'park', 'park_id', 'driver_name', 'status']

class TripSerializer(serializers.ModelSerializer):
    # Let user post route_id / bus_id
    route_id = serializers.PrimaryKeyRelatedField(
        queryset=Route.objects.all(), source='route', write_only=True
    )
    bus_id = serializers.PrimaryKeyRelatedField(
        queryset=Bus.objects.all(), source='bus', write_only=True
    )
    route = RouteSerializer(read_only=True)
    bus = BusSerializer(read_only=True)

    # 1) New input field: user supplies a FULL date+time
    departure_datetime = serializers.DateTimeField(write_only=True)

    # 2) These two are read-only for the actual stored date & time
    travel_date = serializers.DateField(read_only=True)
    departure_time = serializers.TimeField(read_only=True)

    class Meta:
        model = Trip
        fields = [
            'id',
            'route_id', 'bus_id',  # incoming references
            'route', 'bus',        # read-only details
            'departure_datetime',  # the full datetime from the frontend
            'travel_date',         # read-only date in DB
            'departure_time',      # read-only time in DB
            'seat_price',
        ]

    def validate_departure_datetime(self, dt):
        """Optional: ensure it's in the future."""
        if dt < timezone.now():
            raise serializers.ValidationError("Departure time must be in the future.")
        return dt

    def create(self, validated_data):
        # Extract the single datetime from the client
        dt = validated_data.pop('departure_datetime')
        # Convert to separate fields
        validated_data['travel_date'] = dt.date()
        validated_data['departure_time'] = dt.time()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'departure_datetime' in validated_data:
            dt = validated_data.pop('departure_datetime')
            validated_data['travel_date'] = dt.date()
            validated_data['departure_time'] = dt.time()
        return super().update(instance, validated_data)
       
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
        return super().update(instance, validated_data)