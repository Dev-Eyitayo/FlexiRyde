from django.contrib import admin
from .models import City, BusPark, Route, IndirectRoute, Bus, Seat, Trip, SeatReservation, Booking


# Register your models here.
admin.site.register(City)
admin.site.register(BusPark)    
admin.site.register(Route)
admin.site.register(IndirectRoute)
admin.site.register(Booking)
admin.site.register(Bus)
admin.site.register(Seat)
admin.site.register(Trip)
admin.site.register(SeatReservation)

