# accounts/serializers.py
from rest_framework import serializers
from .models import User
from core.serializers import BusParkSerializer

class UserSerializer(serializers.ModelSerializer):
    managed_parks = BusParkSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'role', 'managed_parks']