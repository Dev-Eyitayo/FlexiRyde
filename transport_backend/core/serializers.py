import uuid
from .utils import generate_ref_code
from datetime import datetime
from django.utils import timezone
from django.db import models
from rest_framework import serializers
from .models import City, BusPark, Route, IndirectRoute, Booking, Trip, Bus, SeatAssignment
from django.db import transaction
from dateutil.parser import parse
from dateutil.parser import parse
import logging
import pytz 

logger = logging.getLogger(__name__)

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
    bookings_count = serializers.SerializerMethodField()
    seats_taken = serializers.SerializerMethodField()
    departure_datetime = serializers.DateTimeField()
    available_seats = serializers.IntegerField(read_only=True)
    booked_seats = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = [
            'id',
            'departure_datetime',
            'seat_price',
            'bus',
            'route',
            'available_seats',
            'bookings_count',
            'seats_taken',
            'booked_seats',
        ]

    def get_bus(self, obj):
        return {
            "id": obj.bus.id,
            "number_plate": obj.bus.number_plate,
            "total_seats": obj.bus.total_seats,
        }

    def get_route(self, obj):
        return {
            "id": obj.route.id,
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

    def get_bookings_count(self, obj):
        return obj.bookings.filter(status__in=["pending", "confirmed"]).count()

    def get_seats_taken(self, obj):
        return obj.bookings.filter(status__in=["pending", "confirmed"]).aggregate(
            total_seats=models.Sum('seat_count')
        )['total_seats'] or 0

    def get_booked_seats(self, obj):
        return list(SeatAssignment.objects.filter(trip=obj).values_list('seat_number', flat=True))


class BookingCreateSerializer(serializers.ModelSerializer):
    seat_numbers = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        write_only=True,
        required=True
    )

    class Meta:
        model = Booking
        fields = ["trip", "seat_count", "price", "status", "seat_numbers"]

    def validate(self, attrs):
        if not self.partial:
            if "trip" not in attrs:
                raise serializers.ValidationError("Trip is required.")
            if "seat_count" not in attrs:
                raise serializers.ValidationError("Seat count is required.")
            if "price" not in attrs:
                raise serializers.ValidationError("Price is required.")
            if "seat_numbers" not in attrs:
                raise serializers.ValidationError("Seat numbers are required.")

            trip = attrs["trip"]
            seat_count = attrs["seat_count"]
            seat_numbers = attrs["seat_numbers"]

            # Validate seat_count matches the number of seat_numbers
            if len(seat_numbers) != seat_count:
                raise serializers.ValidationError(
                    f"Number of seats selected ({len(seat_numbers)}) does not match seat_count ({seat_count})."
                )

            # Validate seat_numbers are unique
            if len(set(seat_numbers)) != len(seat_numbers):
                raise serializers.ValidationError("Duplicate seat numbers are not allowed.")

            # Validate seat_numbers are within bus capacity
            if max(seat_numbers, default=0) > trip.bus.total_seats:
                raise serializers.ValidationError(
                    f"Seat numbers must be between 1 and {trip.bus.total_seats}."
                )

            # Check if any seats are already booked
            existing_seats = SeatAssignment.objects.filter(
                trip=trip, seat_number__in=seat_numbers
            ).values_list('seat_number', flat=True)
            if existing_seats:
                raise serializers.ValidationError(
                    f"Seats {list(existing_seats)} are already booked."
                )

            # Validate seat_count
            if seat_count < 1:
                raise serializers.ValidationError("Must book at least 1 seat.")

            if seat_count > trip.available_seats:
                raise serializers.ValidationError(
                    f"Only {trip.available_seats} seats are available."
                )

            # Validate price
            expected_price = trip.seat_price * seat_count
            if attrs["price"] != expected_price:
                raise serializers.ValidationError(
                    f"Price must be {expected_price} for {seat_count} seats."
                )

        if "status" in attrs:
            status_value = attrs["status"]
            instance = self.instance
            if status_value == "cancelled" and instance:
                if instance.trip.departure_datetime < timezone.now():
                    raise serializers.ValidationError("Cannot cancel past bookings.")
                if instance.status == "cancelled":
                    raise serializers.ValidationError("Booking is already cancelled.")

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        trip = validated_data["trip"]
        seat_count = validated_data["seat_count"]
        seat_numbers = validated_data.pop("seat_numbers")
        payment_reference = generate_ref_code(trip)

        # Lock the trip to prevent concurrent modifications
        trip = Trip.objects.select_for_update().get(id=trip.id)
        if seat_count > trip.available_seats:
            raise serializers.ValidationError(
                f"Only {trip.available_seats} seats are available."
            )

        # Re-validate seat availability
        existing_seats = SeatAssignment.objects.filter(
            trip=trip, seat_number__in=seat_numbers
        ).values_list('seat_number', flat=True)
        if existing_seats:
            raise serializers.ValidationError(
                f"Seats {list(existing_seats)} are already booked."
            )

        # Create the booking
        booking = Booking.objects.create(
            user=self.context["request"].user,
            trip=trip,
            seat_count=seat_count,
            price=validated_data["price"],
            payment_reference=payment_reference,
            status="pending",
            payment_status="pending",
        )

        # Create seat assignments
        for seat_number in seat_numbers:
            SeatAssignment.objects.create(
                booking=booking,
                trip=trip,
                seat_number=seat_number
            )

        # Decrease available seats
        trip.available_seats -= seat_count
        trip.save()

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
    route_id = serializers.PrimaryKeyRelatedField(
        queryset=Route.objects.all(), source='route', write_only=True
    )
    bus_id = serializers.PrimaryKeyRelatedField(
        queryset=Bus.objects.all(), source='bus', write_only=True
    )
    route = RouteSerializer(read_only=True)
    bus = BusSerializer(read_only=True)
    departure_datetime = serializers.DateTimeField()

    class Meta:
        model = Trip
        fields = [
            'id',
            'route_id', 'bus_id',
            'route', 'bus',
            'departure_datetime',
            'seat_price',
        ]

    def validate_departure_datetime(self, dt):
        raw_input = self.initial_data.get('departure_datetime', dt)
        logger.info(f"Raw departure_datetime input: {raw_input}")

        if isinstance(dt, str):
            try:
                dt = parse(dt, ignoretz=False)  # Parse datetime, respect timezone if provided
                logger.info(f"Parsed datetime: {dt}")
            except ValueError:
                raise serializers.ValidationError(
                    "Invalid datetime format. Use ISO 8601 (e.g., '2025-05-02T01:00:00Z') or a valid datetime string (e.g., '2025-05-02 01:00:00')."
                )

        # Ensure the datetime is timezone-aware
        if not timezone.is_aware(dt):
            logger.info(f"Converting naive datetime {dt} to {timezone.get_current_timezone_name()}")
            dt = timezone.make_aware(dt, timezone=timezone.get_current_timezone())

        # Log the final datetime in UTC
        utc_dt = dt.astimezone(pytz.UTC)  # Use pytz.UTC instead of timezone.utc
        logger.info(f"Final departure_datetime: {dt} (UTC: {utc_dt})")

        # Check if departure time is in the future
        now = timezone.now()
        if dt < now:
            raise serializers.ValidationError(f"Departure time must be in the future. Provided: {dt} (UTC: {utc_dt}), Now: {now}")

        return dt    
    
    
    
    
    
class BookingSerializer(serializers.ModelSerializer):
    trip = TripSerializer(read_only=True)
    trip_id = serializers.PrimaryKeyRelatedField(
        queryset=Trip.objects.all(), source='trip', write_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'trip', 'trip_id',
            'price', 'payment_reference', 'payment_status',
            'status', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']

    def validate(self, attrs):
        if "trip_id" in attrs:
            trip = attrs["trip_id"]
            if not Trip.objects.filter(id=trip.id).exists():
                raise serializers.ValidationError("Invalid trip.")

        if "status" in attrs or "payment_status" in attrs:
            instance = self.instance
            if not instance:
                raise serializers.ValidationError("Instance required for updates.")

            # Validate status
            if "status" in attrs:
                status_value = attrs["status"]
                if status_value == "cancelled":
                    if instance.trip.departure_datetime < timezone.now():
                        raise serializers.ValidationError("Cannot cancel past bookings.")
                    if instance.status == "cancelled":
                        raise serializers.ValidationError("Booking is already cancelled.")
                    time_until_departure = instance.trip.departure_datetime - timezone.now()
                    if time_until_departure.total_seconds() < 12 * 3600:
                        raise serializers.ValidationError(
                            "Cannot cancel bookings within 12 hours of departure."
                        )

            # Validate payment_status
            if "payment_status" in attrs:
                payment_status = attrs["payment_status"]
                if payment_status == "completed" and instance.payment_status != "completed":
                    if instance.trip.available_seats < instance.seat_count:
                        raise serializers.ValidationError(
                            f"Only {instance.trip.available_seats} seats are available."
                        )

        return attrs

    def update(self, instance, validated_data):
        # Handle payment completion and seat allocation
        if validated_data.get("payment_status") == "completed" and instance.payment_status != "completed":
            with transaction.atomic():
                trip = Trip.objects.select_for_update().get(id=instance.trip.id)
                if trip.available_seats < instance.seat_count:
                    raise serializers.ValidationError(
                        f"Only {trip.available_seats} seats are available."
                    )
                trip.available_seats -= instance.seat_count
                trip.save()
                instance.payment_status = "completed"
                instance.status = "confirmed"  # Update status to confirmed
                instance.save()

        # Handle cancellation
        elif validated_data.get("status") == "cancelled" and instance.status != "cancelled":
            with transaction.atomic():
                trip = Trip.objects.select_for_update().get(id=instance.trip.id)
                if instance.payment_status == "completed":  # Only increment if seats were reserved
                    trip.available_seats += instance.seat_count
                    trip.save()
                instance.status = "cancelled"
                instance.save()

        else:
            # Handle other updates
            instance = super().update(instance, validated_data)

        return instance



class TripTicketSerializer(serializers.ModelSerializer):
    route = serializers.SerializerMethodField()
    bus = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = ["departure_datetime", "seat_price", "route", "bus"]

    def get_route(self, obj):
        origin_park = obj.route.origin_park
        destination_park = obj.route.destination_park

        return {
            "origin_park": {
                "id": origin_park.id,  
                "name": origin_park.name
            },
            "destination_park": {
                "id": destination_park.id,  
                "name": destination_park.name
            },
            "origin_city": {
                "name": origin_park.city.name
            },
            "destination_city": {
                "name": destination_park.city.name
            }
        }

    def get_bus(self, obj):
        return {
            "name": obj.bus.number_plate
        }

class BookingDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    trip = TripTicketSerializer()
    user = serializers.SerializerMethodField()
    ref_number = serializers.CharField(source="payment_reference")
    seats = serializers.IntegerField(source="seat_count")
    status = serializers.CharField()
    payment_status = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)  # Add created_at

    class Meta:
        model = Booking
        fields = [
            "id", "ref_number", "price", "trip", "user",
            "seats", "status", "payment_status", "created_at"  # Include created_at
        ]

    def get_user(self, obj):
        return {
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name
        }
class PaymentInitializationSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    authorization_url = serializers.URLField(read_only=True)



