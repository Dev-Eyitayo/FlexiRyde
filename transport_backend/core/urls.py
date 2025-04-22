# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CityViewSet, BusParkViewSet, RouteViewSet, BookingViewSet,
    TripSearchAPIView, TripViewSet, BookingCreateAPIView, BusViewSet,
    ParkBusesView, ParkRoutesView, ParkTripsView, TripCreateView,
    InitializePaymentView, PaymentCallbackView, PaystackWebhookView
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
    path('payment/initialize/', InitializePaymentView.as_view(), name='initialize-payment'),
    path('payment/callback/', PaymentCallbackView.as_view(), name='payment-callback'),
    path('webhook/paystack/', PaystackWebhookView.as_view(), name='paystack-webhook'),
    path('', include(router.urls)),
]


# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import (
#     CityViewSet, BusParkViewSet, RouteViewSet, BookingViewSet,
#     TripSearchAPIView, TripViewSet, BookingCreateAPIView, BusViewSet,
#     ParkBusesView, ParkRoutesView, ParkTripsView, TripCreateView,
#     InitializePaymentView, PaymentCallbackView, PaystackWebhookView
# )

# router = DefaultRouter()
# router.register('cities', CityViewSet)
# router.register('parks', BusParkViewSet)
# router.register('routes', RouteViewSet)
# router.register('bookings', BookingViewSet, basename='bookings')
# router.register('trips', TripViewSet)
# router.register('buses', BusViewSet)

# urlpatterns = [
#     path('trips/search/', TripSearchAPIView.as_view(), name='trip-search'),
#     path('api/bookings/create/', BookingCreateAPIView.as_view(), name='booking-create'),
#     path('parks/<int:park_id>/buses/', ParkBusesView.as_view(), name='park_buses'),
#     path('parks/<int:park_id>/routes/', ParkRoutesView.as_view(), name='park_routes'),
#     path('parks/<int:park_id>/trips/create/', TripCreateView.as_view(), name='trip_create'),
#     path('parks/<int:park_id>/trips/', ParkTripsView.as_view(), name='park_trips'),
#     path('payment/initialize/', InitializePaymentView.as_view(), name='initialize-payment'),
#     path('payment/callback/', PaymentCallbackView.as_view(), name='payment-callback'),
#     path('webhook/paystack/', PaystackWebhookView.as_view(), name='paystack-webhook'),
#     path('', include(router.urls)),
# ]