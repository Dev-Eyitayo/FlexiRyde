import random
from datetime import timedelta, time, date

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.contrib.auth import get_user_model

from core.models import City, BusPark, Route, Bus, Trip, Booking

User = get_user_model()


FIRST_NAMES = [
    "T'Challa", "Arya", "Logan", "Loki", "Daenerys", "Neo", "Diana", "Killmonger",
    "Geralt", "Selina", "Bruce", "Yennefer", "Tony", "Wanda", "Obi-Wan", "Natasha", "Dexter"
]

LAST_NAMES = [
    "Wayne", "Stark", "Skywalker", "Targaryen", "Kenobi", "Maximoff", "Snow", "Luthor",
    "Romanoff", "Morpheus", "Bladewalker", "Lanister", "Wick", "Strange", "Winchester"
]


class Command(BaseCommand):
    help = 'Seeds the database with updated schema-compliant data.'

    def handle(self, *args, **kwargs):
        self.create_new_admins()

        self.stdout.write(self.style.SUCCESS('Successfully created new admin users.'))
        
    def create_new_admins(self): 
        self.park_admins = []
        """
        Create new admin users with random usernames and passwords.
        """
        for i in range(6, 15):
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