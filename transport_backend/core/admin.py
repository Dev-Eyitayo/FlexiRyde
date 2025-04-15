from django.contrib import admin
from .models import City, BusPark, Route, IndirectRoute, Bus, Trip, Booking

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'slug', 'latitude', 'longitude')
    search_fields = ('name', 'state')
    prepopulated_fields = {"slug": ("name", "state")}  # auto-generate slug
    ordering = ('state', 'name')


@admin.register(BusPark)
class BusParkAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'city', 'status', 'admin')
    list_filter = ('status', 'city')
    search_fields = ('name', 'code')
    ordering = ('city__state', 'name')
    raw_id_fields = ('admin',)  # if there are too many users
    autocomplete_fields = ('city',)


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('origin_park', 'destination_park', 'distance_km', 'estimated_duration_min', 'status')
    list_filter = ('status', 'origin_park__city', 'destination_park__city')
    search_fields = ('origin_park__name', 'destination_park__name')


@admin.register(IndirectRoute)
class IndirectRouteAdmin(admin.ModelAdmin):
    list_display = ('start_park', 'transit_city', 'destination_city', 'total_distance', 'total_price')
    list_filter = ('transit_city', 'destination_city')
    search_fields = ('start_park__name', 'transit_city__name', 'destination_city__name')


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ('number_plate', 'total_seats', 'park', 'driver_name', 'status')
    list_filter = ('status', 'park')
    search_fields = ('number_plate', 'driver_name')
    ordering = ('park',)


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('route', 'bus', 'departure_datetime', 'available_seats', 'seat_price')
    list_filter = ('route__origin_park__city', 'bus', 'departure_datetime')
    search_fields = ('route__origin_park__name', 'route__destination_park__name', 'bus__number_plate')
    ordering = ('-departure_datetime',)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'trip', 'price', 'payment_reference', 'status', 'created_at', 'seat_count')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'payment_reference', 'trip__route__origin_park__name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


