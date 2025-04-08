# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CityViewSet, BusParkViewSet, RouteViewSet, BookingViewSet,
    TripSearchAPIView, TripViewSet, BookingCreateAPIView, BusViewSet,
    ParkBusesView, ParkRoutesView, ParkTripsView, TripCreateView
)

router = DefaultRouter()
router.register('cities', CityViewSet)
router.register('parks', BusParkViewSet)
router.register('routes', RouteViewSet)
router.register('bookings', BookingViewSet, basename='bookings')
router.register('trips', TripViewSet)
router.register('buses', BusViewSet)

urlpatterns = [
    path('trips/search/', TripSearchAPIView.as_view(), name='trip-search'),
    path("bookings/create/", BookingCreateAPIView.as_view(), name="booking-create"),
    path('parks/<int:park_id>/buses/', ParkBusesView.as_view(), name='park_buses'),
    path('parks/<int:park_id>/routes/', ParkRoutesView.as_view(), name='park_routes'),
    path('parks/<int:park_id>/trips/create/', TripCreateView.as_view(), name='trip_create'),
    path('parks/<int:park_id>/trips/', ParkTripsView.as_view(), name='park_trips'),
    path('', include(router.urls)),
]