# from django.contrib.auth.models import AbstractUser, BaseUserManager
# from django.db import models

# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError("The Email must be set")
#         email = self.normalize_email(email)
#         extra_fields.setdefault("role", "passenger")  # Default to passenger
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save()
#         return user

#     def create_superuser(self, email, password, **extra_fields):
#         extra_fields.setdefault("is_staff", True)
#         extra_fields.setdefault("is_superuser", True)
#         extra_fields.setdefault("role", "developer")  # 👈 set developer role here

#         if extra_fields.get("is_staff") is not True:
#             raise ValueError("Superuser must have is_staff=True.")
#         if extra_fields.get("is_superuser") is not True:
#             raise ValueError("Superuser must have is_superuser=True.")

#         return self.create_user(email, password, **extra_fields)

# class User(AbstractUser):
#     ROLE_CHOICES = (
#         ('passenger', 'Passenger'),
#         ('park_admin', 'Park Admin'),
#         ('developer', 'Developer'),
#     )

#     email = models.EmailField(unique=True)
#     nin = models.CharField(max_length=11, unique=True, null=True, blank=True)
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='passenger')

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['username']

#     objects = CustomUserManager()  # ✅ use custom manager

#     def __str__(self):
#         return f"{self.email} ({self.get_role_display()})"
# #


from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("role", "passenger")  # Default to passenger
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "developer")  # Set developer role

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    ROLE_CHOICES = (
        ('passenger', 'Passenger'),
        ('park_admin', 'Park Admin'),
        ('developer', 'Developer'),
    )

    email = models.EmailField(unique=True)
    nin = models.CharField(max_length=11, unique=True, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='passenger')
    username = None  # Remove username field

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # No required fields

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"