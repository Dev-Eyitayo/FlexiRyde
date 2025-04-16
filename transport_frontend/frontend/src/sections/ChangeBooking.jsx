import { useEffect, useState } from "react";
import authFetch from "../utils/authFetch";
import { toast } from "react-toastify";

export default function ChangeBooking() {
  const [bookingRef, setBookingRef] = useState("");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [newDate, setNewDate] = useState("");
  const [availableTrips, setAvailableTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [price, setPrice] = useState(0);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const response = await authFetch(`/bookings/ref/${bookingRef}/`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Booking not found.");
        return;
      }

      const status = data.status.toLowerCase();
      const now = new Date();
      const depDate = new Date(data.trip.departure_datetime);

      if (status === "cancelled") {
        setError("This booking was canceled and cannot be modified.");
      } else if (depDate < now) {
        setError(
          "This booking has already expired. Please create a new booking."
        );
      } else {
        setBooking(data);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  function formatTime(datetimeString) {
    const date = new Date(datetimeString);
    return date
      .toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace("am", "AM")
      .replace("pm", "PM");
  }

  // Fetch new times when date changes
  useEffect(() => {
    const fetchTimes = async () => {
      if (!newDate || !booking) return;

      const origin = booking.trip.route.origin_park.id;
      const destination = booking.trip.route.destination_park.id;

      try {
        const response = await authFetch(
          `/trips/search/?origin_id=${origin}&destination_id=${destination}&date=${newDate}`
        );
        const data = await response.json();

        // Filter trips with enough seats
        const validTrips = data.filter(
          (trip) => trip.available_seats >= booking.seats
        );
        setAvailableTrips(validTrips);
        setSelectedTripId("");
      } catch (err) {
        toast.error("Failed to load available departure times.");
      }
    };

    fetchTimes();
  }, [newDate, booking]);

  const handleSubmit = async () => {
    if (!selectedTripId) {
      toast.warning("Please select a new travel time.");
      return;
    }

    try {
      const response = await authFetch(`/bookings/${booking.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ trip_id: selectedTripId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Booking updated successfully!", {
          position: "top-right",         // top-right, top-center, top-left, bottom-right, etc.
          autoClose: 2000,               // delay in milliseconds (0 = stays until manually closed)
          hideProgressBar: false,        // show/hide progress bar
          closeOnClick: true,            // allow toast to be closed on click
          pauseOnHover: true,            // pause timer on hover
          draggable: true,               // allow dragging the toast
          progress: undefined,           // you can control progress manually if needed
          theme: "colored",              // colored | light | dark
        });
        setTimeout(() => {
          window.location.href = "/check-ticket"; // or use navigate()
        }, 2000);
      } else {
        toast.error(data.message || "Failed to update booking.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className='max-w-3xl mx-auto px-4 py-10'>
      {!booking && (
        <div className='bg-white shadow-md rounded-xl p-6 max-w-lg mx-auto'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
            🔍 Find Your Booking
          </h2>
          <form onSubmit={handleSearch}>
            <label className='block mb-2 text-sm font-medium text-gray-600'>
              Booking Reference Number
            </label>
            <input
              type='text'
              placeholder='e.g. REF-20250426-DUGBE65-XYZ'
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              required
              className='w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 mb-3'
            />
            <p className='text-xs text-gray-500 mb-4'>
              Find your booking reference in the travel history page
            </p>
            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold'
            >
              {loading ? "Searching..." : "Search Booking 🔍"}
            </button>
          </form>
          {error && (
            <p className='text-red-600 text-sm mt-4 font-medium text-center'>
              {error}
            </p>
          )}
        </div>
      )}

      {booking && (
        <div>
          {/* Note */}
          <div className='bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6'>
            <p className='text-sm text-blue-800 font-medium'>
              <strong>Important Note:</strong> <br />
              To change the number of seats or travel destination, please cancel
              this booking and request a refund on the Travel History page, then
              create a new booking.
            </p>
          </div>

          {/* Booking Info */}
          <div className='bg-white shadow-md rounded-lg p-6 mb-8'>
            <h3 className='text-lg font-bold text-gray-800 mb-4'>
              Current Booking Details
            </h3>
            <div className='grid grid-cols-2 gap-4 text-sm text-gray-700'>
              <div>
                <strong>Bus Park:</strong> {booking.trip.route.origin_park.name}
              </div>
              <div>
                <strong>Time:</strong>{" "}
                {formatTime(booking.trip.departure_datetime)}
              </div>
              <div>
                <strong>Route:</strong> {booking.trip.route.origin_city.name} →{" "}
                {booking.trip.route.destination_city.name}
              </div>
              <div>
                <strong>Seats Booked:</strong> {booking.seats}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(booking.trip.departure_datetime).toLocaleDateString()}
              </div>
              <div>
                <strong>Total Price:</strong> ₦{booking.price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Change Section */}
          <div className='bg-white shadow-md rounded-lg p-6'>
            <h3 className='text-lg font-bold text-gray-800 mb-4'>
              Change Travel Date & Time
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              {/* Date Picker */}
              <div>
                <label className='block mb-2 text-sm font-medium text-gray-600'>
                  New Travel Date
                </label>
                <input
                  type='date'
                  className='w-full px-4 py-3 border rounded-lg shadow-sm'
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>

              {/* Time Select */}
              <div>
                <label className='block mb-2 text-sm font-medium text-gray-600'>
                  New Travel Time
                </label>
                <select
                  value={selectedTripId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedTripId(id);
                    const trip = availableTrips.find((t) => t.id === parseInt(id));
                    setPrice(trip?.seat_price || 0);
                  }}
                  className="w-full px-4 py-3 border rounded-lg shadow-sm"
                >
                  <option value="">Select a time</option>
                  {availableTrips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {formatTime(trip.departure_datetime)} — ₦{trip.seat_price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold'
            >
              Confirm Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
