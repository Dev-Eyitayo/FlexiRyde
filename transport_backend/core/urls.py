from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name='index'),  # Add your URL patterns here
]
