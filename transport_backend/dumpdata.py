import os
import django
from django.core.management import call_command

# Set up Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "transport_backend.settings")
django.setup()

# Dump the data into a UTF-8 JSON file
with open("full_data.json", "w", encoding="utf-8") as f:
    call_command("dumpdata",
                 use_natural_foreign_keys=True,
                 use_natural_primary_keys=True,
                 exclude=["contenttypes", "auth.Permission"],
                 indent=2,
                 stdout=f)
