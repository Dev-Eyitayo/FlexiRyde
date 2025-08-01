from django.db import models
from django.conf import settings


class City(models.Model):
    name = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True, null=True)  #Take note of this 
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        unique_together = ('name', 'state')
        ordering = ['state', 'name']

    def __str__(self):
        return f"{self.name}, {self.state}"

    

class BusPark(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True, blank=True, null=True)  #Take note of this 
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='parks')
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=20, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
                              limit_choices_to={'role': 'park_admin'}, related_name='managed_parks')

    def __str__(self):
        return f"{self.name} ({self.city.name})"

    
class Route(models.Model):
    origin_park = models.ForeignKey(BusPark, on_delete=models.CASCADE, related_name='routes_from')
    destination_park = models.ForeignKey(BusPark, on_delete=models.CASCADE, related_name='direct_routes')
    distance_km = models.FloatField()
    estimated_duration_min = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('active', 'Active'), ('disabled', 'Disabled')], default='active')

    def __str__(self):
        return f"{self.origin_park.name} ➜ {self.destination_park.name}"

    
class IndirectRoute(models.Model):
    start_park = models.ForeignKey(BusPark, on_delete=models.CASCADE, related_name='indirect_starts')
    transit_city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='transit_points')
    destination_city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='indirect_ends')
    total_distance = models.FloatField()
    total_price = models.FloatField()

    def __str__(self):
        return f"{self.start_park.city.name} ➜ {self.transit_city.name} ➜ {self.destination_city.name}"

class Bus(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('maintenance', 'Under Maintenance'),
        ('on_trip', 'Currently on Trip'),
    ]

    number_plate = models.CharField(max_length=20, unique=True)
    total_seats = models.PositiveIntegerField(default=24)
    park = models.ForeignKey('BusPark', on_delete=models.CASCADE, related_name='buses')
    driver_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')

    def save(self, *args, **kwargs):
        if self.park.admin and self.park.admin.role != 'park_admin':
            raise ValueError("Bus can only be assigned to a park managed by a park admin.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.number_plate} ({self.total_seats} seats at {self.park.name})"


class Trip(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='trips')
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='trips')
    departure_datetime = models.DateTimeField(null=True, blank=True)  # Replace travel_date and departure_time
    seat_price = models.FloatField(null=True, blank=True)
    available_seats = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('route', 'bus', 'departure_datetime')
        ordering = ['departure_datetime']

    def __str__(self):
        return f"{self.route} on {self.departure_datetime.date()}"

    @property
    def travel_date(self):
        return self.departure_datetime.date()

    @property
    def departure_time(self):
        return self.departure_datetime.time()

    def save(self, *args, **kwargs):
        # If creating a new Trip and no explicit 'available_seats', 
        # default it to the bus capacity.
        if self.pk is None and self.available_seats is None:
            self.available_seats = self.bus.total_seats
        # Prevent user from assigning a value bigger than the bus capacity:
        if self.available_seats and self.available_seats > self.bus.total_seats:
            raise ValueError("Available seats cannot exceed the bus total seats.")
        super().save(*args, **kwargs)

class Booking(models.Model):
    STATUS_CHOICES = (
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    )
    
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed')
    )
    

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='bookings', null=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    price = models.FloatField()
    payment_reference = models.CharField(max_length=100, unique=True)  #Take note of this 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    # How many seats this booking is actually taking
    seat_count = models.PositiveIntegerField(default=1)

    def __str__(self):
         return f"{self.user.email} | {self.trip.route.origin_park.name} → {self.trip.route.destination_park.name}"


class SeatAssignment(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='seat_assignments')
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='seat_assignments')
    seat_number = models.PositiveIntegerField()

    class Meta:
        unique_together = ('trip', 'seat_number')  # Ensure a seat is only booked once per trip
        indexes = [
            models.Index(fields=['trip', 'seat_number']),
        ]

    def __str__(self):
        return f"Seat {self.seat_number} for Booking {self.booking.id} on Trip {self.trip.id}"

    def clean(self):
        # Validate that seat_number is within the bus's total seats
        if self.seat_number < 1 or self.seat_number > self.trip.bus.total_seats:
            raise models.ValidationError(f"Seat number must be between 1 and {self.trip.bus.total_seats}.")