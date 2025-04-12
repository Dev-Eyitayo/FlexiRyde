import random
import string
from datetime import datetime
from .models import Booking 

def generate_ref_code(trip, length=5):
    """
    Generate a unique reference code for a booking.
    Format: REF-<DATE>-<PLATE>-<RANDOM>
    Example: REF-20250411-DUGBE65-2A9FJ
    """
    # 1. Get trip date in YYYYMMDD format
    date_str = trip.departure_datetime.strftime("%Y%m%d")
    
    # 2. Get bus number plate and strip special characters
    raw_plate = trip.bus.number_plate.upper().replace(" ", "").replace("-", "")
    plate_part = ''.join(filter(str.isalnum, raw_plate))[:7]  # Max 7 chars

    while True:
        # 3. Generate random code
        rand_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

        # 4. Construct the reference
        ref = f"REF-{date_str}-{plate_part}-{rand_str}"

        # 5. Check if it already exists
        if not Booking.objects.filter(payment_reference=ref).exists():
            return ref