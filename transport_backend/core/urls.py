from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CityViewSet, BusParkViewSet, RouteViewSet, BookingViewSet,
    TripSearchAPIView, TripViewSet, BookingCreateAPIView
)

router = DefaultRouter()
router.register('cities', CityViewSet)
router.register('parks', BusParkViewSet)
router.register('routes', RouteViewSet)
router.register('bookings', BookingViewSet, basename='bookings')
router.register('trips', TripViewSet)


urlpatterns = [
    path('trips/search/', TripSearchAPIView.as_view(), name='trip-search'),
    path("bookings/create/", BookingCreateAPIView.as_view(), name="booking-create"),
    path('', include(router.urls)),
    
]
