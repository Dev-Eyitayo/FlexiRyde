import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import authFetch from "../utils/authFetch";
import { useNavigate } from "react-router-dom";

export default function TravelHistory() {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [cancelTrip, setCancelTrip] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await authFetch("/bookings/");
        const data = await response.json();

        const formatted = data.map((booking) => {
          const trip = booking.trip || {};
          const route = trip.route || {};
          const datetime = new Date(trip.departure_datetime);

          return {
            id: booking.id,
            from: route.origin_park?.name || "—",
            to: route.destination_park?.name || "—",
            date: datetime.toLocaleDateString("en-NG", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            time: datetime.toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            seats: booking.seats ?? booking.seat_count ?? "—",
            price: `₦${Number(booking.price).toLocaleString()}`,
            bookingRef: booking.ref_number ?? booking.payment_reference,
            status: booking.status?.toLowerCase() || "confirmed",
            originalBooking: booking,
          };
        });

        setTrips(formatted);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast.error("Failed to load travel history");
      }
    };

    fetchTrips();
  }, []);

  const filteredTrips =
    filter === "all" ? trips : trips.filter((trip) => trip.status === filter);

  const handleCancelClick = (trip) => {
    setCancelTrip(trip);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    try {
      const response = await authFetch(`/bookings/${cancelTrip.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (response.ok) {
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === cancelTrip.id ? { ...trip, status: "cancelled" } : trip
          )
        );
        toast.success(`Trip to ${cancelTrip.to} cancelled successfully!`);
      } else {
        toast.error("Failed to cancel trip.");
      }
    } catch (err) {
      toast.error("Error occurred during cancellation.");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100/45 p-4 md:p-6'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-xl md:text-2xl font-bold mb-6'>
          Your Travel History
        </h1>

        <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
          {["all", "confirmed", "completed", "cancelled"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2 py-1 font-semibold md:text-sm text-[10px] rounded-full ${
                filter === type ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {filteredTrips.length === 0 ? (
          <p className='text-center text-gray-500 mt-10'>
            No trips found for this status.
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {filteredTrips.map((trip) => {
              let badgeClasses =
                "px-3 py-1 text-xs rounded-full font-semibold ";
              if (trip.status === "confirmed") {
                badgeClasses += "bg-green-100 text-green-700";
              } else if (trip.status === "completed") {
                badgeClasses += "bg-gray-200 text-gray-700";
              } else {
                badgeClasses += "bg-red-100 text-red-700";
              }

              return (
                <div
                  key={trip.id}
                  className='bg-white p-5 md:p-7 rounded-2xl shadow-md w-full max-w-3xl'
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <h2 className='text-base font-semibold flex items-center gap-2'>
                        <FaMapMarkerAlt className='text-blue-500' />
                        {trip.from} → {trip.to}
                      </h2>
                      <div className='flex items-center gap-4 mt-2'>
                        <span className={`${badgeClasses} flex items-center`}>
                          {trip.status.charAt(0).toUpperCase() +
                            trip.status.slice(1)}
                        </span>
                        <span className='text-gray-600 text-sm'>
                          Ref: {trip.bookingRef}
                        </span>
                      </div>
                    </div>
                    <span className='text-base font-semibold'>
                      {trip.price}
                    </span>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-5'>
                    <div className='flex items-center text-gray-700 text-sm'>
                      <FaCalendarAlt className='mr-2 text-blue-500' />
                      {trip.date}
                    </div>
                    <div className='flex items-center text-gray-700 text-sm'>
                      <FaClock className='mr-2 text-blue-500' />
                      {trip.time}
                    </div>
                    <div className='flex items-center text-gray-700 text-sm'>
                      <FaUser className='mr-2 text-blue-500' />
                      {trip.seats} seat{trip.seats > 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className='flex justify-end mt-4'>
                    {trip.status === "confirmed" && (
                      <button
                        onClick={() => handleCancelClick(trip)}
                        className='px-4 py-2 rounded-md text-sm font-medium
                        border bg-red-500 text-white
                        hover:bg-red-600 transition-colors
                        focus:outline-none'
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() =>
                        navigate("/check-ticket", {
                          state: { booking: trip.originalBooking },
                        })
                      }
                      className='ml-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition'
                    >
                      View Ticket
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && cancelTrip && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl p-6 shadow-xl max-w-md mx-3 w-full'>
              <h2 className='text-base font-bold text-red-600 mb-3'>
                Confirm Cancellation
              </h2>
              <div className='space-y-2 mb-6 text-sm'>
                <p className='text-gray-700'>
                  You are about to cancel your trip to{" "}
                  <span className='font-semibold'>{cancelTrip.to}</span>.
                </p>
                <p className='text-gray-700'>
                  <span className='font-semibold'>Booking Ref:</span>{" "}
                  {cancelTrip.bookingRef}
                </p>
                <p className='text-gray-700'>
                  The refund will be processed within 5 working days.
                </p>
              </div>
              <div className='flex justify-end gap-3'>
                <button
                  className='bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 px-4 py-2 rounded-lg font-medium transition'
                  onClick={() => setShowModal(false)}
                >
                  Go Back
                </button>
                <button
                  className='bg-red-500 text-sm hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition'
                  onClick={confirmCancel}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
