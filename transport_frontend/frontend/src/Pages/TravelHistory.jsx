import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import authFetch from "../utils/authFetch"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBus,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    upcoming: {
      color: "bg-blue-100 text-blue-800",
      icon: <FaInfoCircle className='mr-1' />,
    },
    completed: {
      color: "bg-green-100 text-green-800",
      icon: <FaCheckCircle className='mr-1' />,
    },
    canceled: {
      color: "bg-red-100 text-red-800",
      icon: <FaTimesCircle className='mr-1' />,
    },
  };

  return (
    <span
      className={`${statusConfig[status].color} px-3 py-1 rounded-full text-sm font-medium flex items-center`}
    >
      {statusConfig[status].icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const dummyTrips = [
  {
    id: 1,
    from: "Lagos",
    to: "Abuja",
    date: "2025-04-10",
    time: "09:00 AM",
    seats: 2,
    status: "upcoming",
    price: "₦15,000",
    bookingRef: "TRP-2025-001",
  },
  {
    id: 2,
    from: "Ibadan",
    to: "Enugu",
    date: "2025-03-20",
    time: "01:30 PM",
    seats: 1,
    status: "completed",
    price: "₦12,000",
    bookingRef: "TRP-2025-002",
  },
  {
    id: 3,
    from: "Port Harcourt",
    to: "Calabar",
    date: "2025-04-08",
    time: "04:45 PM",
    seats: 3,
    status: "upcoming",
    price: "₦10,000",
    bookingRef: "TRP-2025-003",
  },
  {
    id: 4,
    from: "Kano",
    to: "Jos",
    date: "2025-04-12",
    time: "07:00 AM",
    seats: 1,
    status: "canceled",
    price: "₦8,000",
    bookingRef: "TRP-2025-004",
  },
  {
    id: 5,
    from: "Benin",
    to: "Lagos",
    date: "2025-03-15",
    time: "06:15 PM",
    seats: 2,
    status: "completed",
    price: "₦9,500",
    bookingRef: "TRP-2025-005",
  },
];

const TravelHistory = () => {
  // const [trips, setTrips] = useState(dummyTrips);
  const [showModal, setShowModal] = useState(false);
  const [cancelTrip, setCancelTrip] = useState(null);
  const [filter, setFilter] = useState("all");
  const [trips, setTrips] = useState([]);


  const handleCancel = (trip) => {
    setCancelTrip(trip);
    setShowModal(true);
  };

  const confirmCancel = () => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === cancelTrip.id ? { ...trip, status: "canceled" } : trip
      )
    );
    setShowModal(false);
    toast.success(`Trip to ${cancelTrip.to} cancelled successfully!`, {
      autoClose: 1500,
    });
  };

  const filteredTrips = trips.filter(
    (trip) => filter === "all" || trip.status === filter
  );

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await authFetch("/bookings/");
        const data = await response.json();
        setTrips(
          data.map((booking) => ({
            id: booking.id,
            from: booking.trip.route.origin_park.name,
            to: booking.trip.route.destination_park.name,
            date: new Date(booking.trip.departure_datetime).toLocaleDateString("en-NG", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric"
            }),
            time: new Date(booking.trip.departure_datetime).toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            }),
            seats: booking.seat_count,
            price: `₦${Number(booking.price).toLocaleString()}`,
            bookingRef: booking.payment_reference,
            status: booking.status.toLowerCase(), // "confirmed", "cancelled", etc.
          }))
        );
      } catch (err) {
        console.error("Error loading bookings", err);
      }
    };
  
    fetchTrips();
  }, []);
  

  return (
    <div className='min-h-screen bg-gray-100/45 p-4 md:p-6'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-xl md:text-2xl font-bold mb-6'>
          Your Travel History
        </h1>

        <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-1 font-semibold md:text-sm text-[10px] rounded-full ${filter === "all" ? "bg-blue-600 text-white" : "bg-white"}`}
          >
            All Trips
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-2 py-1 font-semibold md:text-sm text-[10px] rounded-full ${filter === "upcoming" ? "bg-blue-600 text-white" : "bg-white"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-2 py-1 font-semibold md:text-sm text-[10px] rounded-full ${filter === "completed" ? "bg-blue-600 text-white" : "bg-white"}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("canceled")}
            className={`px-2 py-1 font-semibold md:text-sm text-[10px] rounded-full ${filter === "canceled" ? "bg-blue-600 text-white" : "bg-white"}`}
          >
            Canceled
          </button>
        </div>

        <div className='grid gap-4'>
          {filteredTrips.length === 0 ? (
            <div className='bg-white p-4 md:p-6 rounded-2xl shadow-md w-full text-center text-sm py-8'>
              <p className='text-gray-500'>No trips found for this filter</p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='flex justify-center'
              >
                <div className='bg-white p-5 md:p-7 rounded-2xl shadow-md w-full max-w-3xl'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h2 className='text-base font-semibold flex items-center gap-2'>
                        <FaBus className='text-blue-500' />
                        {trip.from} → {trip.to}
                      </h2>
                      <div className='flex items-center gap-4 mt-2'>
                        <StatusBadge status={trip.status} size={8} />
                        <span className='text-gray-600 text-sm'>
                          Ref: {trip.bookingRef}
                        </span>
                      </div>
                    </div>
                    <span className='text-base font-semibold'>
                      {trip.price}
                    </span>
                  </div>

                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
                    <div className='flex items-center text-sm gap-2'>
                      <FaCalendarAlt className='text-gray-400 ' />
                      <span>{trip.date}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <FaClock className='text-gray-400' />
                      <span>{trip.time}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <FaUser className='text-gray-400' />
                      <span>
                        {trip.seats} seat{trip.seats > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {trip.status === "upcoming" && (
                    <div className='flex justify-end mt-4'>
                      <button
                        className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm transition'
                        onClick={() => handleCancel(trip)}
                      >
                        Cancel Trip
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        <ToastContainer position='top-right' />
        <AnimatePresence>
          {showModal && cancelTrip && (
            <motion.div
              className='fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                className='bg-white rounded-xl p-6 shadow-xl max-w-md mx-3 w-full'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
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
                  {/* <p className='text-gray-700'>
                    <span className='font-semibold'>Refund Amount:</span>{" "}
                    {cancelTrip.price}
                  </p> */}
                  <p className='text-gray-700'>
                    The refund will be processed within 5 working days.
                  </p>
                </div>
                <div className='flex justify-end gap-3'>
                  <button
                    className='bg-gray-200 hover:bg-gray-300  text-sm text-gray-800 px-4 py-2 rounded-lg font-medium transition'
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TravelHistory;
