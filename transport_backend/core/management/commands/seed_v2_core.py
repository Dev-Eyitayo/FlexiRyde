import random
from datetime import timedelta, time, date

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.contrib.auth import get_user_model

from core.models import City, BusPark, Route, Bus, Trip, Booking

User = get_user_model()

FIRST_NAMES = [
    "Tolu", "Aminu", "Chinwe", "Ugochi", "Femi", "Ngozi", "Suleiman", "Ade", "Kelechi",
    "Hadiza", "Bola", "Ifeanyi", "Chuka", "Fatima", "Samuel", "Olumide", "Blessing"
]

LAST_NAMES = [
    "Adedayo", "Okonkwo", "Nwosu", "Olawale", "Yakubu", "Ibrahim", "Bello", "Adeyemi",
    "Eze", "Abubakar", "Ogunleye", "Anyanwu", "Adewale", "Balogun", "Okwuosa"
]

REAL_PARKS_BY_CITY = {
    "Lagos": [
        ("Jibowu Terminal", 6.5175, 3.3721),
        ("Ojota New Garage", 6.5892, 3.3703),
        ("Mile 2 Park", 6.4654, 3.3133),
        ("CMS Bus Park", 6.4500, 3.4000)
    ],
    "Abuja": [
        ("Utako Motor Park", 9.0723, 7.4496),
        ("Garki Model Park", 9.0292, 7.5004),
        ("Area 1 Bus Terminal", 9.0350, 7.4891),
        ("Berger Junction", 9.0667, 7.4833)
    ],
    "Ibadan": [
        ("Iwo Road Park", 7.3916, 3.9377),
        ("Challenge Park", 7.3601, 3.8753),
        ("Dugbe Park", 7.3878, 3.8964),
        ("Ojoo Motor Park", 7.4519, 3.9004)
    ]
}

class Command(BaseCommand):
    help = 'Seeds the database with updated schema-compliant data.'

    def handle(self, *args, **kwargs):
        Booking.objects.all().delete()
        Trip.objects.all().delete()
        Bus.objects.all().delete()
        Route.objects.all().delete()
        BusPark.objects.all().delete()
        City.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        self.create_users()
        self.create_cities_and_parks()
        self.create_buses()
        self.create_routes_and_trips()

        self.stdout.write(self.style.SUCCESS('✅ Database seeded successfully.'))

    def create_users(self):
        self.passengers = []
        self.park_admins = []
        used_usernames = set()

        for _ in range(50):
            while True:
                fname = random.choice(FIRST_NAMES)
                lname = random.choice(LAST_NAMES)
                username = f"{fname.lower()}{lname.lower()}{random.randint(100,999)}"
                if username not in used_usernames and not User.objects.filter(username=username).exists():
                    used_usernames.add(username)
                    break
            user = User.objects.create_user(
                username=username,
                email=f"{username}@example.com",
                password="pass12345",
                first_name=fname,
                last_name=lname,
                nin=f"9{random.randint(10**9, 10**10 - 1)}",
                role='passenger'
            )
            self.passengers.append(user)

        for i in range(6):
            fname = random.choice(FIRST_NAMES)
            lname = random.choice(LAST_NAMES)
            admin = User.objects.create_user(
                username=f"admin{i}",
                email=f"admin{i}@parks.com",
                password="pass12345",
                first_name=fname,
                last_name=lname,
                nin=f"9{random.randint(10**9, 10**10 - 1)}",
                role='park_admin'
            )
            self.park_admins.append(admin)

    def create_cities_and_parks(self):
        self.parks = []
        self.city_map = {}

        for city_name, parks in REAL_PARKS_BY_CITY.items():
            city = City.objects.create(
                name=city_name,
                state=city_name,
                slug=slugify(city_name),
                latitude=parks[0][1],
                longitude=parks[0][2]
            )
            self.city_map[city_name] = city

            for park_name, lat, lon in parks:
                park = BusPark.objects.create(
                    name=park_name,
                    code=slugify(park_name)[:5].upper() + str(random.randint(10, 99)),
                    city=city,
                    latitude=lat,
                    longitude=lon,
                    admin=random.choice(self.park_admins),
                    status='active'
                )
                self.parks.append(park)

    def create_buses(self):
        self.buses = []
        for park in self.parks:
            for _ in range(random.randint(1, 3)):
                bus = Bus.objects.create(
                    number_plate=f"{park.code}-{random.randint(100,999)}",
                    total_seats=24,
                    park=park,
                    driver_name=random.choice(FIRST_NAMES) + " " + random.choice(LAST_NAMES),
                    status='available'
                )
                self.buses.append(bus)

    def create_routes_and_trips(self):
        self.routes = []
        self.trips = []
        used_keys = set()

        for i in range(len(self.parks)):
            for j in range(len(self.parks)):
                if i != j and random.random() > 0.6:
                    route = Route.objects.create(
                        origin_park=self.parks[i],
                        destination_park=self.parks[j],
                        distance_km=round(random.uniform(100, 700), 1),
                        estimated_duration_min=random.randint(120, 600),
                        status='active'
                    )
                    self.routes.append(route)

        # for route in self.routes:
        #     for i in range(7):
        #         travel_date = date.today() + timedelta(days=i)
        #         for _ in range(random.randint(1, 2)):
        #             bus = random.choice(self.buses)
        #             key = (route.id, bus.id, travel_date)
        #             if key in used_keys:
        #                 continue
        #             used_keys.add(key)
        #             trip = Trip.objects.create(
        #                 route=route,
        #                 bus=bus,
        #                 travel_date=travel_date,
        #                 departure_time=time(hour=random.randint(6, 18), minute=random.choice([0, 30])),
        #                 seat_price=random.randint(3000, 8000)
        #             )
        #             self.trips.append(trip)

    # def create_bookings(self):
    #     for _ in range(200):
    #         user = random.choice(self.passengers)
    #         trip = random.choice(self.trips)
    #         seat_count = random.randint(1, 4)
    #         price = trip.seat_price * seat_count

    #         Booking.objects.create(
    #             user=user,
    #             trip=trip,
    #             price=price,
    #             payment_reference=f"REF{random.randint(10000, 99999)}",
    #             status='confirmed'
    #         )
