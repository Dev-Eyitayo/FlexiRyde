from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import City, BusPark, Route
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed core app with more realistic data for South West Nigeria'

    def handle(self, *args, **kwargs):
        # --- Expanded Cities ---
        cities = [
            {"name": "Ibadan", "state": "Oyo", "lat": 7.3775, "lng": 3.9470},
            {"name": "Lagos", "state": "Lagos", "lat": 6.5244, "lng": 3.3792},
            {"name": "Abeokuta", "state": "Ogun", "lat": 7.1608, "lng": 3.3481},
            {"name": "Akure", "state": "Ondo", "lat": 7.2508, "lng": 5.2103},
            {"name": "Osogbo", "state": "Osun", "lat": 7.7719, "lng": 4.5560},
            {"name": "Ado Ekiti", "state": "Ekiti", "lat": 7.6219, "lng": 5.2210},
        ]

        city_objs = {}
        for city in cities:
            obj, _ = City.objects.get_or_create(
                name=city["name"],
                state=city["state"],
                defaults={"latitude": city["lat"], "longitude": city["lng"]}
            )
            city_objs[city["name"]] = obj
        self.stdout.write(self.style.SUCCESS("✅ Seeded cities."))

        # --- Park Admins & Parks ---
        admins = [
            {"email": "jibowu.admin@travyule.com", "username": "jibowu_admin", "nin": "12345678901", "parks": ["Jibowu Terminal"]},
            {"email": "ibadan.admin@travyule.com", "username": "ibadan_admin", "nin": "23456789012", "parks": ["Challenge Park", "Iwo Road Park"]},
            {"email": "abeokuta.admin@travyule.com", "username": "abeokuta_admin", "nin": "34567890123", "parks": ["Kuto Park"]},
            {"email": "osogbo.admin@travyule.com", "username": "osogbo_admin", "nin": "45678901234", "parks": ["Old Garage"]},
            {"email": "akure.admin@travyule.com", "username": "akure_admin", "nin": "56789012345", "parks": ["Fiwasaye Junction Park"]},
        ]

        all_parks = []

        for admin in admins:
            existing_user = User.objects.filter(email=admin["email"]).first()
            if not existing_user:
                if User.objects.filter(nin=admin["nin"]).exists():
                    self.stdout.write(self.style.WARNING(f"⚠️ Skipped admin {admin['email']}: NIN already exists"))
                    continue
                user = User.objects.create_user(
                    email=admin["email"],
                    username=admin["username"],
                    password="adminpass123",
                    nin=admin["nin"],
                    role="park_admin"
                )
            else:
                user = existing_user

            for park_name in admin["parks"]:
                for city_name in city_objs:
                    if city_name.lower() in admin["username"]:
                        city = city_objs[city_name]
                        park, _ = BusPark.objects.get_or_create(
                            name=park_name,
                            city=city,
                            defaults={
                                "latitude": city.latitude,
                                "longitude": city.longitude,
                                "admin": user
                            }
                        )
                        all_parks.append(park)

        self.stdout.write(self.style.SUCCESS("✅ Seeded park admins and their parks."))

        # --- Passengers (20) ---
        for i in range(1, 21):
            email = f"passenger{i}@travyule.com"
            nin = f"90110000{i:03d}"
            username = f"user{i}"

            if not User.objects.filter(email=email).exists():
                if User.objects.filter(nin=nin).exists():
                    self.stdout.write(self.style.WARNING(f"⚠️ Skipped passenger {email}: NIN already exists"))
                    continue
                User.objects.create_user(
                    email=email,
                    username=username,
                    password="pass12345",
                    nin=nin,
                    role="passenger"
                )
        self.stdout.write(self.style.SUCCESS("✅ Seeded 20 passengers."))

        # --- Routes Between All Parks and All Cities ---
        for park in all_parks:
            for city in city_objs.values():
                if city != park.city:
                    Route.objects.get_or_create(
                        origin_park=park,
                        destination_city=city,
                        defaults={
                            "distance_km": round(random.uniform(60, 350), 1)
                        }
                    )
        self.stdout.write(self.style.SUCCESS("✅ Seeded full route map from all parks."))

        self.stdout.write(self.style.SUCCESS("🌱 Massive seeding complete! System is alive and ready."))
