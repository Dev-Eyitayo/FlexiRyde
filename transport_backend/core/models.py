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
    travel_date = models.DateField(null=True, blank=True)
    departure_time = models.TimeField(null=True)
    seat_price = models.FloatField(null=True, blank=True)
    available_seats = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('route', 'bus', 'travel_date')
        ordering = ['travel_date']

    def __str__(self):
        return f"{self.route} on {self.travel_date}"

    def save(self, *args, **kwargs):
        if self.pk is None and self.available_seats is None:
            # On first creation, default to bus total seats
            self.available_seats = self.bus.total_seats
        elif self.available_seats is not None and self.available_seats > self.bus.total_seats:
            raise ValueError("Available seats cannot exceed bus total seats")
        super().save(*args, **kwargs)


class Booking(models.Model):
    STATUS_CHOICES = (
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='bookings', null=True)
    price = models.FloatField()
    payment_reference = models.CharField(max_length=100, unique=True)  #Take note of this 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
         return f"{self.user.email} | {self.trip.route.origin_park.name} → {self.trip.route.destination_park.name}"
