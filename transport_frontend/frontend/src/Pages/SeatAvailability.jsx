// components/SeatAvailability.jsx

import { useState, useEffect } from "react";
import SeatSelector from "../components/SeatSelector";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RouteVisualization from "../components/RouteVisualization";
import { FaClock, FaExclamationTriangle } from "react-icons/fa";
import authFetch from "../utils/authFetch";

export default function SeatAvailability() {
  const location = useLocation();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Pull from location.state: an array of trips and the user search data
  const trips = location.state?.trips || [];
  const travelData = location.state?.searchInfo || {};
  const { from, to, date, passengers: bookedSeats } = travelData;

  // Keep track of the user’s currently selected trip
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || "");
  const [trip, setTrip] = useState(trips[0] || null);

  // For seat calculations and price
  const [currentSeats, setCurrentSeats] = useState({
    totalSeats: 24,
    takenSeats: 0,
    bookedSeats: [], // List of booked seat numbers
  });
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([]); // Selected seats
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Whenever user changes trip selection, update `trip`
  useEffect(() => {
    const selected = trips.find((t) => t.id === Number(selectedTripId));
    setTrip(selected || null);
  }, [selectedTripId, trips]);

  // Update seat and price details based on selected trip
  useEffect(() => {
    if (!trip) return;

    const totalSeats = trip.bus?.total_seats ?? 24;
    const takenSeats = trip.seats_taken ?? 0; // Use seats_taken from TripListSerializer
    const bookedSeats = trip.booked_seats ?? []; // From TripListSerializer
    console.log("Trip object =>", JSON.stringify(trip, null, 2));
    console.log(
      "Total Seats:",
      totalSeats,
      "Taken Seats:",
      takenSeats,
      "Booked Seats:",
      bookedSeats
    );

    setCurrentSeats({ totalSeats, takenSeats, bookedSeats });
    setPrice(trip.seat_price ?? 1500);
    setSelectedSeatNumbers([]); // Reset selected seats when trip changes
  }, [trip]);

  // Check if enough seats remain and correct number of seats selected
  const isSeatAvailable =
    currentSeats.totalSeats - currentSeats.takenSeats >= bookedSeats &&
    selectedSeatNumbers.length === bookedSeats;

  // Handle seat selection
  const handleSeatsSelected = (seats) => {
    setSelectedSeatNumbers(seats);
  };

  // Handle booking and payment
  const handleProceed = async () => {
    let token =
      localStorage.getItem("access") || sessionStorage.getItem("access");
    if (!token) {
      toast.warning("🔐 Please log in to proceed with booking.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
      return;
    }

    if (selectedSeatNumbers.length !== bookedSeats) {
      toast.error(
        `Please select exactly ${bookedSeats} seat(s). You have selected ${selectedSeatNumbers.length}.`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    const available = currentSeats.totalSeats - currentSeats.takenSeats;
    if (available < bookedSeats) {
      toast.error(
        `Only ${available} seat(s) available. Please choose fewer seats.`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    setLoading(true);

    try {
      // Create the booking
      const bookingPayload = {
        trip: Number(selectedTripId),
        seat_count: bookedSeats,
        price: price * bookedSeats,
        seat_numbers: selectedSeatNumbers, // Include selected seats
      };
      console.log("Calling /api/bookings/create/ with:", bookingPayload);

      const bookingResponse = await authFetch("/bookings/create/", {
        method: "POST",
        body: JSON.stringify(bookingPayload),
      });

      const bookingContentType = bookingResponse.headers.get("content-type");
      console.log("Booking response status:", bookingResponse.status);
      console.log("Booking response headers:", {
        "content-type": bookingContentType,
        location: bookingResponse.headers.get("location"),
      });

      if (
        !bookingContentType ||
        !bookingContentType.includes("application/json")
      ) {
        const text = await bookingResponse.text();
        console.error(
          "Booking non-JSON response (first 500 chars):",
          text.slice(0, 500)
        );
        throw new Error(
          `Received non-JSON response from bookings/create (status: ${bookingResponse.status})`
        );
      }

      const bookingData = await bookingResponse.json();
      console.log("Booking response data:", bookingData);

      if (!bookingResponse.ok) {
        throw new Error(bookingData?.message || "Booking failed");
      }

      // Initialize payment
      const paymentPayload = { booking_id: bookingData.booking.id };
      let paymentResponse = await authFetch("/payment/initialize/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentPayload),
      });

      if (paymentResponse.status === 401) {
        console.log("Payment call returned 401, attempting token refresh...");
        const refresh =
          localStorage.getItem("refresh") || sessionStorage.getItem("refresh");
        if (!refresh) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await authFetch("/auth/token/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });

        if (!refreshResponse.ok) {
          throw new Error("Failed to refresh token");
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.access;
        const storage = localStorage.getItem("access")
          ? localStorage
          : sessionStorage;
        storage.setItem("access", token);

        paymentResponse = await authFetch("/payment/initialize/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paymentPayload),
        });
      }

      const paymentContentType = paymentResponse.headers.get("content-type");
      console.log("Payment response status:", paymentResponse.status);
      console.log("Payment response headers:", {
        "content-type": paymentContentType,
        location: paymentResponse.headers.get("location"),
      });

      if (
        !paymentContentType ||
        !paymentContentType.includes("application/json")
      ) {
        const text = await paymentResponse.text();
        console.error(
          "Payment non-JSON response (first 500 chars):",
          text.slice(0, 500)
        );
        throw new Error(
          `Received non-JSON response from payment/initialize (status: ${paymentResponse.status})`
        );
      }

      const paymentData = await paymentResponse.json();
      console.log("Payment initialization response:", paymentData);

      if (paymentResponse.ok && paymentData.authorization_url) {
        toast.success("Redirecting to payment page...", {
          position: "top-right",
          autoClose: 2000,
        });
        window.location.href = paymentData.authorization_url;
      } else {
        throw new Error(paymentData?.error || "Failed to initialize payment");
      }
    } catch (err) {
      console.error("❌ Error in handleProceed:", err);
      toast.error(`Error: ${err.message || "Something went wrong."}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Time display helper
  function formatTime(datetimeStr) {
    if (!datetimeStr) return "—";
    const date = new Date(datetimeStr);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 lg:px-8'>
      <ToastContainer position='top-right' autoClose={2000} />

      {/* Title */}
      <div className='w-full max-w-6xl text-center mb-8'>
        <h1 className='md:text-3xl text-2xl font-bold text-gray-800 mb-2'>
          Seat Availability
        </h1>
        <p className='text-gray-600'>
          Select departure time to view seat availability
        </p>
      </div>

      {/* Optional route visualization */}
      <RouteVisualization
        route={{
          from,
          to,
          date,
          time: trip?.departure_datetime
            ? formatTime(trip.departure_datetime)
            : "—",
          intermediateStops: [],
        }}
      />

      {/* Trip selection */}
      <div className='w-full max-w-4xl mb-6'>
        <label
          htmlFor='time'
          className='block text-lg text-gray-700 mb-2 font-medium'
        >
          Select Departure Time
        </label>
        <div className='relative'>
          <select
            id='time'
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className='w-full appearance-none border border-gray-300 bg-white rounded-lg pl-4 pr-10 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-50'
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {formatTime(t.departure_datetime)} — ₦
                {t.seat_price?.toLocaleString()}
              </option>
            ))}
          </select>

          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500'>
            <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M5.23 7.21a.75.75 0 011.06.02L10 11.585l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Travel Summary */}
      <div className='bg-white rounded-lg shadow-md w-full max-w-4xl mb-8 p-6 border border-gray-100'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
          <FaClock className='mr-2 text-blue-500' />
          Travel Details
        </h2>
        <div className='space-y-4'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>From:</span>
            <span className='font-medium'>{from}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>To:</span>
            <span className='font-medium'>{to}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Date:</span>
            <span className='font-medium'>{date}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Departure:</span>
            <span className='font-medium'>
              {formatTime(trip?.departure_datetime)}
            </span>
          </div>
        </div>
      </div>

      {/* Seat Breakdown */}
      <div className='bg-white rounded-lg shadow-md w-full max-w-4xl mb-8 p-6 border border-gray-100'>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>
          Seat Availability
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p className='text-gray-600'>Total Seats</p>
            <p className='text-2xl font-bold text-gray-800'>
              {currentSeats.totalSeats}
            </p>
          </div>
          <div className='bg-green-50 p-4 rounded-lg'>
            <p className='text-gray-600'>Available Seats</p>
            <p className='text-2xl font-bold text-green-600'>
              {currentSeats.totalSeats - currentSeats.takenSeats}
            </p>
          </div>
          <div className='bg-red-50 p-4 rounded-lg'>
            <p className='text-gray-600'>Booked Seats</p>
            <p className='text-2xl font-bold text-red-600'>
              {currentSeats.takenSeats}
            </p>
          </div>
        </div>

        {!isSeatAvailable && (
          <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md'>
            <div className='flex items-start'>
              <FaExclamationTriangle className='text-yellow-500 mt-1 mr-2' />
              <div>
                <p className='font-medium text-yellow-800'>Action Required</p>
                <p className='text-sm text-yellow-700'>
                  {selectedSeatNumbers.length !== bookedSeats
                    ? `Please select exactly ${bookedSeats} seat(s).`
                    : `Only ${currentSeats.totalSeats - currentSeats.takenSeats} seat(s) available. Please reduce number of seats or change your departure time.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='bg-white rounded-lg shadow-md w-full max-w-4xl mb-8 p-6 border border-gray-100'>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>
          Choose Your Seat(s)
        </h3>
        <SeatSelector
          totalSeats={currentSeats.totalSeats}
          maxSelectable={bookedSeats}
          bookedSeats={currentSeats.bookedSeats}
          onSeatsSelected={handleSeatsSelected}
        />
        {selectedSeatNumbers.length > 0 && (
          <p className='mt-4 text-gray-600'>
            Selected Seats: {selectedSeatNumbers.join(", ")}
          </p>
        )}
      </div>

      {/* Payment */}
      <div className='bg-white rounded-lg shadow-md w-full max-w-4xl mb-8 p-6 border border-gray-100'>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>
          Payment Summary
        </h3>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Seats to Book:</span>
            <span className='font-medium'>{bookedSeats}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Price per Seat:</span>
            <span className='font-medium'>₦{price.toLocaleString()}</span>
          </div>
          <div className='border-t border-gray-200 pt-3'>
            <div className='flex justify-between'>
              <span className='text-gray-600 font-semibold'>Total Amount:</span>
              <span className='text-gray-800 text-lg font-bold'>
                ₦{(price * bookedSeats).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Book Button */}
      <div className='w-full max-w-4xl'>
        <button
          onClick={handleProceed}
          disabled={!isSeatAvailable || loading}
          className={`w-full md:py-4 py-3 md:px-6 px-4 rounded-lg md:text-lg text-base font-semibold transition-all duration-300 shadow-md ${
            isSeatAvailable
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 hover:shadow-lg"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading
            ? "Processing..."
            : isSeatAvailable
              ? `Proceed to Book ${bookedSeats} Seat(s)`
              : selectedSeatNumbers.length !== bookedSeats
                ? `Select ${bookedSeats} Seat(s)`
                : "Not Enough Seats"}
        </button>
      </div>
    </div>
  );
}
