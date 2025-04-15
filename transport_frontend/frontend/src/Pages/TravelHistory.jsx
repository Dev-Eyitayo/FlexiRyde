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

  // --------------------
  // Fetch bookings
  // --------------------
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
            fromCity: route.origin_city?.name || "",
            to: route.destination_park?.name || "—",
            toCity: route.destination_city?.name || "",
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

        console.log("Raw bookings response:", data);

        setTrips(formatted);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchTrips();
  }, []);

  // --------------------
  // Filtering
  // --------------------
  const filteredTrips =
    filter === "all" ? trips : trips.filter((trip) => trip.status === filter);

  // --------------------
  // Cancel logic
  // --------------------
  const handleCancelClick = (trip) => {
    setCancelTrip(trip);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    console.log("Cancel Trip Object:", JSON.stringify(cancelTrip, null, 2));
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

  // --------------------
  // UI
  // --------------------
  return (
    <div className='min-h-screen bg-gray-200/30 px-4 py-10'>
      <div className='max-w-5xl mx-auto'>
        {/* Title */}
        <h1 className='text-2xl md:text-3xl font-bold mb-6'>Travel History</h1>

        {/* Filter Buttons */}
        <div className='flex flex-wrap gap-3 mb-8'>
          {["all", "confirmed", "completed", "cancelled"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium shadow 
                transition-transform transform hover:scale-105 focus:outline-none
                ${
                  filter === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }
              `}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Trip List */}
        {filteredTrips.length === 0 ? (
          <p className='text-center text-gray-500 mt-10'>
            No trips found for this status.
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {filteredTrips.map((trip) => {
              // Determine badge style by status
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
                  className='relative bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-6'
                >
                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 text-sm right-3 ${badgeClasses}`}
                  >
                    {trip.status}
                  </span>

                  {/* Route + Reference */}
                  <div className='sm:flex sm:justify-between sm:items-start'>
                    <div className='mb-4 mt-4 sm:mb-0'>
                      <h2 className='md:text-lg sm:mt-3 text-base font-bold text-gray-800 mb-1'>
                        {trip.from}{" "}
                        {/* {trip.fromCity && (
                          <span className='text-sm text-gray-500'>
                            ({trip.fromCity})
                          </span>
                        )} */}
                        <span className='mx-2 text-gray-400'>→</span>
                        {trip.to}{" "}
                        {/* {trip.toCity && (
                          <span className='text-sm text-gray-500'>
                            ({trip.toCity})
                          </span>
                        )} */}
                      </h2>
                      <p className='text-xs text-gray-500'>
                        Ref:{" "}
                        <span className='font-mono'>{trip.bookingRef}</span>
                      </p>
                    </div>
                  </div>

                  {/* Trip Details */}
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

                  {/* Price + Actions */}
                  <div className='flex justify-between items-center mt-6'>
                    <span className='text-xl font-bold text-gray-800'>
                      {trip.price}
                    </span>

                    <div className='flex flex-row '>
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
                </div>
              );
            })}
          </div>
        )}

        {/* Cancel Modal */}
        {showModal && cancelTrip && (
          <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
            <div
              className='bg-white p-6 rounded-xl shadow-lg w-full max-w-md
                         transform transition-all duration-300 scale-100'
            >
              <h2 className='text-2xl font-bold text-red-600 mb-3'>
                Cancel Trip
              </h2>
              <p className='text-sm text-gray-600 mb-5'>
                Are you sure you want to cancel your trip from{" "}
                <strong>{cancelTrip.from}</strong> to{" "}
                <strong>{cancelTrip.to}</strong>?
              </p>
              <div className='flex justify-end space-x-3'>
                <button
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 rounded-md text-sm bg-gray-200 text-gray-700
                             hover:bg-gray-300 transition-colors
                             focus:outline-none'
                >
                  Close
                </button>
                <button
                  onClick={confirmCancel}
                  className='px-4 py-2 rounded-md text-sm bg-red-600 text-white
                             hover:bg-red-700 transition-colors
                             focus:outline-none'
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
