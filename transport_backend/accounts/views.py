import random
from rest_framework.decorators import api_view # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore
from rest_framework import status # type: ignore
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from django.contrib.auth import get_user_model # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from .serializers import UserSerializer, PasswordResetConfirmSerializer, PasswordResetSerializer
import requests
from google.oauth2 import id_token # type: ignore
from google.auth.transport import requests as google_requests # type: ignore
from django.conf import settings # type: ignore

from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


User = get_user_model()

def generate_temp_nin():
    while True:
        fake_nin = f"9{random.randint(10**9, 10**10 - 1)}"
        if not User.objects.filter(nin=fake_nin).exists():
            return fake_nin

@api_view(['POST'])
def signup(request):
    data = request.data
    try:
        user = User.objects.create_user(
            # username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            nin=generate_temp_nin(),
            role='passenger'
        )
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                # 'username': user.username,
                'role': user.role,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'email': self.user.email,
            # 'username': self.user.username,
            'role': self.user.role,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    

@api_view(['POST'])
def google_auth(request):
    try:
        id_token_str = request.data.get('access_token')
        if not id_token_str:
            return Response({'error': 'ID token is required'}, status=status.HTTP_400_BAD_REQUEST)

        print("Received ID token:", id_token_str)

        client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
        user_info = id_token.verify_oauth2_token(
            id_token_str,
            google_requests.Request(),
            client_id,
            clock_skew_in_seconds=60  # Allow 60 seconds of clock skew
        )

        print("Google user info:", user_info)

        email = user_info.get('email')
        if not email:
            return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': user_info.get('given_name', ''),
                'last_name': user_info.get('family_name', ''),
                'nin': generate_temp_nin(),
                'role': 'passenger',
            }
        )

        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': serializer.data,
        }, status=status.HTTP_200_OK)
    except ValueError as e:
        print("Token verification error:", str(e))
        return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("General error:", str(e))
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)




class PasswordResetRequestView(APIView):
    throttle_classes = [AnonRateThrottle]  # Apply DRF throttling

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)

        # Generate reset token
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = user.pk

        # Build reset URL
        reset_url = f"{settings.SITE_PROTOCOL}://{settings.SITE_DOMAIN}/reset-password/{uid}/{token}/"

        # Render HTML email
        html_message = render_to_string('account/email/password_reset_email.html', {
            'user': user,
            'reset_url': reset_url,
        })
        plain_message = strip_tags(html_message)

        # Send email
        send_mail(
            subject='Password Reset Request',
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        return Response({"detail": "Password reset link sent."}, status=status.HTTP_200_OK)   
class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(pk=serializer.validated_data['uid'])
        
        # Update password
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)