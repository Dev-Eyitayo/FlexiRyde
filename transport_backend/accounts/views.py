import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
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
    
    

# import requests
# from .serializers import UserSerializer
# from .views import generate_temp_nin


# @api_view(['POST'])
# def google_auth(request):
#     try:
#         id_token_str = request.data.get('access_token')
#         if not id_token_str:
#             return Response({'error': 'ID token is required'}, status=status.HTTP_400_BAD_REQUEST)

#         print("Received ID token:", id_token_str)  # Debug

#         client_id = '711592095519-6l061c4j4e5b5rqlpm1isk4l2qsd80f0.apps.googleusercontent.com'
#         user_info = id_token.verify_oauth2_token(
#             id_token_str,
#             google_requests.Request(),
#             client_id
#         )

#         print("Google user info:", user_info)  # Debug

#         email = user_info.get('email')
#         if not email:
#             return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)

#         user, created = User.objects.get_or_create(
#             email=email,
#             defaults={
#                 'first_name': user_info.get('given_name', ''),
#                 'last_name': user_info.get('family_name', ''),
#                 'nin': generate_temp_nin(),
#                 'role': 'passenger',
#             }
#         )

#         refresh = RefreshToken.for_user(user)
#         serializer = UserSerializer(user)

#         return Response({
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#             'user': serializer.data,
#         }, status=status.HTTP_200_OK)
#     except ValueError as e:
#         print("Token verification error:", str(e))  # Debug
#         return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)
#     except Exception as e:
#         print("General error:", str(e))  # Debug
#         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def google_auth(request):
    try:
        id_token_str = request.data.get('access_token')
        if not id_token_str:
            return Response({'error': 'ID token is required'}, status=status.HTTP_400_BAD_REQUEST)

        print("Received ID token:", id_token_str)

        client_id = '711592095519-6l061c4j4e5b5rqlpm1isk4l2qsd80f0.apps.googleusercontent.com'
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

