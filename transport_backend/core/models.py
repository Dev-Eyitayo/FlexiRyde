from django.db import models
from django.conf import settings


class City(models.Model):
    name = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"{self.name}, {self.state}"
    

class BusPark(models.Model):
    name = models.CharField(max_length=100)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='parks')
    latitude = models.FloatField()
    longitude = models.FloatField()
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
                              limit_choices_to={'role': 'park_admin'}, related_name='managed_parks')

    def __str__(self):
        return f"{self.name} ({self.city.name})"
    
class Route(models.Model):
    origin_park = models.ForeignKey(BusPark, on_delete=models.CASCADE, related_name='routes_from')
    destination_city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='direct_routes')
    distance_km = models.FloatField()

    def __str__(self):
        return f"{self.origin_park.name} ➜ {self.destination_city.name}"
    
class IndirectRoute(models.Model):
    start_park = models.ForeignKey(BusPark, on_delete=models.CASCADE, related_name='indirect_starts')
    transit_city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='transit_points')
    destination_city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='indirect_ends')
    total_distance = models.FloatField()
    total_price = models.FloatField()

    def __str__(self):
        return f"{self.start_park.city.name} ➜ {self.transit_city.name} ➜ {self.destination_city.name}"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    origin_park = models.ForeignKey(BusPark, on_delete=models.CASCADE)
    destination_city = models.ForeignKey(City, on_delete=models.CASCADE)
    travel_date = models.DateField()
    price = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} | {self.origin_park.name} → {self.destination_city.name}"

