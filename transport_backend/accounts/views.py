import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, PasswordResetConfirmSerializer, PasswordResetSerializer
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging
from google.auth.transport.requests import Request

logger = logging.getLogger(__name__)

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
                'role': user.role,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'email': self.user.email,
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
        token = request.data.get('access_token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"Received token: {token}")

        # Try to verify as ID token first
        try:
            user_info = id_token.verify_oauth2_token(
                token,
                Request(),
                settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
                clock_skew_in_seconds=100
            )
            logger.info(f"Verified as ID token: {user_info}")
        except ValueError as e:
            logger.info("Not an ID token, trying access token...")
            # Fallback: Validate as access token
            user_info_response = requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {token}"}
            )
            if user_info_response.status_code != 200:
                logger.error(f"Access token validation failed: {user_info_response.text}")
                return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)
            user_info = user_info_response.json()
            logger.info(f"Verified as access token: {user_info}")

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
        logger.error(f"Token verification error: {str(e)}")
        return Response({'error': f"Invalid Google token: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"General error in google_auth: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class PasswordResetRequestView(APIView):
    throttle_classes = [AnonRateThrottle]
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = PasswordResetSerializer(data=request.data)
            if not serializer.is_valid():
                logger.debug(f"Serializer validation failed: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)  # Serializer already validated existence
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = user.pk
            reset_url = f"{settings.SITE_PROTOCOL}://{settings.SITE_DOMAIN}/reset-password/{uid}/{token}/"
            try:
                html_message = render_to_string('password_reset_mail.html', {
                    'user': user,
                    'reset_url': reset_url,
                })
                plain_message = strip_tags(html_message)
            except Exception as e:
                logger.error(f"Template rendering failed: {str(e)}")
                return Response({"detail": "Failed to render email template."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            try:
                send_mail(
                    subject='Password Reset Request',
                    message=plain_message,
                    html_message=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
            except Exception as e:
                logger.error(f"Email sending failed: {str(e)}")
                return Response({"detail": "Failed to send email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"detail": "Password reset link sent."}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Unexpected error in PasswordResetRequestView: {str(e)}")
            return Response({"detail": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class PasswordResetConfirmView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = PasswordResetConfirmSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = User.objects.get(pk=serializer.validated_data['uid'])
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response(
                {"detail": "Password reset successful."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error in PasswordResetConfirmView: {str(e)}")
            return Response(
                {"detail": "Failed to reset password."},
                status=status.HTTP_400_BAD_REQUEST
            )