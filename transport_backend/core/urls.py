from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('cities', CityViewSet)
router.register('parks', BusParkViewSet)
router.register('routes', RouteViewSet)
router.register('bookings', BookingViewSet, basename='bookings')

urlpatterns = [
    path('', include(router.urls)),
    path('trips/<int:trip_id>/seats/', TripSeatAvailabilityView.as_view(), name='trip-seat-availability'),
]
