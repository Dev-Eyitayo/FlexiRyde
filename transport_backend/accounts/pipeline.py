from django.contrib.auth import get_user_model
from .views import generate_temp_nin

User = get_user_model()

def create_google_user(backend, user, response, *args, **kwargs):
    if not user:
        email = response.get('email')
        if not email:
            raise ValueError("Email not provided by Google")
        
        user = User.objects.create_user(
            email=email,
            password=None,
            first_name=response.get('given_name', ''),
            last_name=response.get('family_name', ''),
            nin=generate_temp_nin(),
            role='passenger'
        )
    return {'user': user}