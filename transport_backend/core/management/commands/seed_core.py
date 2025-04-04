import random
from datetime import timedelta, time, date

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.utils import timezone

from core.models import (
    City, BusPark, Route, Bus, Seat, Trip,
    Booking, SeatReservation
)

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with sample cities, parks, buses, routes, trips, users, bookings, and seats.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('⚠️ Deleting old data...'))
        Booking.objects.all().delete()
        SeatReservation.objects.all().delete()
        Trip.objects.all().delete()
        Seat.objects.all().delete()
        Bus.objects.all().delete()
        Route.objects.all().delete()
        BusPark.objects.all().delete()
        City.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        self.stdout.write(self.style.SUCCESS('✅ Cleared old data.\n'))

        self.create_users()
        self.create_cities_and_parks()
        self.create_buses_and_seats()
        self.create_routes_and_trips()
        self.create_bookings()

        self.stdout.write(self.style.SUCCESS('🎉 Database seeded successfully.'))

    def create_users(self):
        self.passengers = []
        self.park_admins = []

        for i in range(15):
            user = User.objects.create_user(
                username=f"user{i}",
                email=f"user{i}@example.com",
                password="pass1234",
                nin=f"9{random.randint(10**9, 10**10 - 1)}",
                role='passenger'
            )
            self.passengers.append(user)

        for i in range(3):
            admin = User.objects.create_user(
                username=f"admin{i}",
                email=f"admin{i}@example.com",
                password="admin1234",
                nin=f"9{random.randint(10**9, 10**10 - 1)}",
                role='park_admin'
            )
            self.park_admins.append(admin)

    def create_cities_and_parks(self):
        city_data = [
            ("Lagos", "Lagos", (6.5244, 3.3792)),
            ("Abuja", "FCT", (9.0579, 7.4951)),
            ("Ibadan", "Oyo", (7.3775, 3.9470)),
            ("Enugu", "Enugu", (6.5244, 7.5086)),
            ("Kano", "Kano", (12.0022, 8.5919)),
        ]

        self.parks = []
        for i, (name, state, (lat, lon)) in enumerate(city_data):
            city = City.objects.create(
                name=name,
                state=state,
                slug=slugify(name),
                latitude=lat,
                longitude=lon,
            )

            for j in range(2):  # 2 parks per city
                park = BusPark.objects.create(
                    name=f"{name} Central Park {j+1}",
                    code=f"{name[:2].upper()}{j+1}",
                    city=city,
                    latitude=lat + random.uniform(-0.01, 0.01),
                    longitude=lon + random.uniform(-0.01, 0.01),
                    admin=random.choice(self.park_admins)
                )
                self.parks.append(park)

    def create_buses_and_seats(self):
        self.buses = []
        for park in self.parks:
            for b in range(2):  # 2 buses per park
                bus = Bus.objects.create(
                    number_plate=f"{park.code}-{random.randint(100, 999)}",
                    total_seats=24,
                    seat_layout='4x6',
                    park=park,
                    driver_name=f"Driver {random.randint(1, 50)}",
                    status='available',
                )
                self.buses.append(bus)

                # Generate 24 seats in 4x6
                for r in range(6):
                    for c in range(4):
                        seat_no = f"{r+1}{chr(65 + c)}"
                        Seat.objects.create(
                            bus=bus,
                            seat_number=seat_no,
                            row=r + 1,
                            column=c + 1,
                        )

    def create_routes_and_trips(self):
        self.routes = []
        for i in range(len(self.parks)):
            for j in range(len(self.parks)):
                if i != j and random.random() > 0.5:
                    origin = self.parks[i]
                    destination_city = self.parks[j].city
                    distance = round(random.uniform(100, 500), 1)
                    route = Route.objects.create(
                        origin_park=origin,
                        destination_city=destination_city,
                        distance_km=distance,
                        estimated_duration_min=int(distance * 0.9)
                    )
                    self.routes.append(route)

        self.trips = []
        for route in self.routes:
            for i in range(3):  # Next 3 days
                travel_date = date.today() + timedelta(days=i)
                departure_time = time(hour=random.randint(6, 16), minute=0)
                trip = Trip.objects.create(
                    route=route,
                    bus=random.choice(self.buses),
                    travel_date=travel_date,
                    departure_time=departure_time,
                    seat_price=random.randint(3000, 7000),
                )
                self.trips.append(trip)

    def create_bookings(self):
        for _ in range(30):
            user = random.choice(self.passengers)
            trip = random.choice(self.trips)
            available_seats = Seat.objects.filter(bus=trip.bus).exclude(
                id__in=SeatReservation.objects.filter(trip=trip).values_list('seat_id', flat=True)
            )
            seat_count = random.randint(1, 3)
            selected_seats = random.sample(list(available_seats), min(seat_count, len(available_seats)))
            price = trip.seat_price * len(selected_seats)

            booking = Booking.objects.create(
                user=user,
                trip=trip,
                price=price,
                payment_reference=f"REF{random.randint(10000, 99999)}",
                status='confirmed',
            )

            for seat in selected_seats:
                SeatReservation.objects.create(
                    trip=trip,
                    seat=seat,
                    booking=booking
                )
