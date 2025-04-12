// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   FaBus,
//   FaCalendarAlt,
//   FaClock,
//   FaUser,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaInfoCircle,
// } from "react-icons/fa";

// const StatusBadge = ({ status }) => {
//   const statusConfig = {
//     upcoming: {
//       color: "bg-blue-100 text-blue-800",
//       icon: <FaInfoCircle className='mr-1' />,
//     },
//     completed: {
//       color: "bg-green-100 text-green-800",
//       icon: <FaCheckCircle className='mr-1' />,
//     },
//     canceled: {
//       color: "bg-red-100 text-red-800",
//       icon: <FaTimesCircle className='mr-1' />,
//     },
//   };

//   return (
//     <span
//       className={`${statusConfig[status].color} px-3 py-1 rounded-full text-sm font-medium flex items-center`}
//     >
//       {statusConfig[status].icon}
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </span>
//   );
// };

// const dummyTrips = [
//   {
//     id: 1,
//     from: "Lagos",
//     to: "Abuja",
//     date: "2025-04-10",
//     time: "09:00 AM",
//     seats: 2,
//     status: "upcoming",
//     price: "₦15,000",
//     bookingRef: "TRP-2025-001",
//   },
//   {
//     id: 2,
//     from: "Ibadan",
//     to: "Enugu",
//     date: "2025-03-20",
//     time: "01:30 PM",
//     seats: 1,
//     status: "completed",
//     price: "₦12,000",
//     bookingRef: "TRP-2025-002",
//   },
//   {
//     id: 3,
//     from: "Port Harcourt",
//     to: "Calabar",
//     date: "2025-04-08",
//     time: "04:45 PM",
//     seats: 3,
//     status: "upcoming",
//     price: "₦10,000",
//     bookingRef: "TRP-2025-003",
//   },
//   {
//     id: 4,
//     from: "Kano",
//     to: "Jos",
//     date: "2025-04-12",
//     time: "07:00 AM",
//     seats: 1,
//     status: "canceled",
//     price: "₦8,000",
//     bookingRef: "TRP-2025-004",
//   },
//   {
//     id: 5,
//     from: "Benin",
//     to: "Lagos",
//     date: "2025-03-15",
//     time: "06:15 PM",
//     seats: 2,
//     status: "completed",
//     price: "₦9,500",
//     bookingRef: "TRP-2025-005",
//   },
// ];

// const TravelHistory = () => {
//   const [trips, setTrips] = useState(dummyTrips);
//   const [showModal, setShowModal] = useState(false);
//   const [cancelTrip, setCancelTrip] = useState(null);
//   const [filter, setFilter] = useState("all");

//   const handleCancel = (trip) => {
//     setCancelTrip(trip);
//     setShowModal(true);
//   };

//   const confirmCancel = () => {
//     setTrips((prev) =>
//       prev.map((trip) =>
//         trip.id === cancelTrip.id ? { ...trip, status: "canceled" } : trip
//       )
//     );
//     setShowModal(false);
//     toast.success(`Trip to ${cancelTrip.to} cancelled successfully!`, {
//       autoClose: 1500,
//     });
//   };

//   const filteredTrips = trips.filter(
//     (trip) => filter === "all" || trip.status === filter
//   );

//   return (
//     <div className='min-h-screen bg-gray-100/45 p-4 md:p-6'>
//       <div className='max-w-5xl mx-auto'>
//         <h1 className='text-xl md:text-2xl font-bold mb-6'>
//           Your Travel History
//         </h1>

//         <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
//           <button
//             onClick={() => setFilter("all")}
//             className={`px-2 py-1 font-semibold md:text-sm text-[10px] rounded-full ${filter === "all" ? "bg-blue-600 text-white" : "bg-white"}`}
//           >
//             All Trips
//           </button>
//           <button
//             onClick={() => setFilter("upcoming")}
//             className={`px-2 py-1 font-semibold md:text-sm text-[10px] rounded-full ${filter === "upcoming" ? "bg-blue-600 text-white" : "bg-white"}`}
//           >
//             Upcoming
//           </button>
//           <button
//             onClick={() => setFilter("completed")}
//             className={`px-2 py-1 font-semibold md:text-sm text-[10px] rounded-full ${filter === "completed" ? "bg-blue-600 text-white" : "bg-white"}`}
//           >
//             Completed
//           </button>
//           <button
//             onClick={() => setFilter("canceled")}
//             className={`px-2 py-1 font-semibold md:text-sm text-[10px] rounded-full ${filter === "canceled" ? "bg-blue-600 text-white" : "bg-white"}`}
//           >
//             Canceled
//           </button>
//         </div>

//         <div className='grid gap-4'>
//           {filteredTrips.length === 0 ? (
//             <div className='bg-white p-4 md:p-6 rounded-2xl shadow-md w-full text-center text-sm py-8'>
//               <p className='text-gray-500'>No trips found for this filter</p>
//             </div>
//           ) : (
//             filteredTrips.map((trip) => (
//               <motion.div
//                 key={trip.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4 }}
//                 className='flex justify-center'
//               >
//                 <div className='bg-white p-5 md:p-7 rounded-2xl shadow-md w-full max-w-3xl'>
//                   <div className='flex justify-between items-start'>
//                     <div>
//                       <h2 className='text-base font-semibold flex items-center gap-2'>
//                         <FaBus className='text-blue-500' />
//                         {trip.from} → {trip.to}
//                       </h2>
//                       <div className='flex items-center gap-4 mt-2'>
//                         <StatusBadge status={trip.status} size={8} />
//                         <span className='text-gray-600 text-sm'>
//                           Ref: {trip.bookingRef}
//                         </span>
//                       </div>
//                     </div>
//                     <span className='text-base font-semibold'>
//                       {trip.price}
//                     </span>
//                   </div>

//                   <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
//                     <div className='flex items-center text-sm gap-2'>
//                       <FaCalendarAlt className='text-gray-400 ' />
//                       <span>{trip.date}</span>
//                     </div>
//                     <div className='flex items-center gap-2 text-sm'>
//                       <FaClock className='text-gray-400' />
//                       <span>{trip.time}</span>
//                     </div>
//                     <div className='flex items-center gap-2 text-sm'>
//                       <FaUser className='text-gray-400' />
//                       <span>
//                         {trip.seats} seat{trip.seats > 1 ? "s" : ""}
//                       </span>
//                     </div>
//                   </div>

//                   {trip.status === "upcoming" && (
//                     <div className='flex justify-end mt-4'>
//                       <button
//                         className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm transition'
//                         onClick={() => handleCancel(trip)}
//                       >
//                         Cancel Trip
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             ))
//           )}
//         </div>

//         <ToastContainer position='top-right' />
//         <AnimatePresence>
//           {showModal && cancelTrip && (
//             <motion.div
//               className='fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50'
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowModal(false)}
//             >
//               <motion.div
//                 className='bg-white rounded-xl p-6 shadow-xl max-w-md mx-3 w-full'
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.8, opacity: 0 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <h2 className='text-base font-bold text-red-600 mb-3'>
//                   Confirm Cancellation
//                 </h2>
//                 <div className='space-y-2 mb-6 text-sm'>
//                   <p className='text-gray-700'>
//                     You are about to cancel your trip to{" "}
//                     <span className='font-semibold'>{cancelTrip.to}</span>.
//                   </p>
//                   <p className='text-gray-700'>
//                     <span className='font-semibold'>Booking Ref:</span>{" "}
//                     {cancelTrip.bookingRef}
//                   </p>
//                   {/* <p className='text-gray-700'>
//                     <span className='font-semibold'>Refund Amount:</span>{" "}
//                     {cancelTrip.price}
//                   </p> */}
//                   <p className='text-gray-700'>
//                     The refund will be processed within 5 working days.
//                   </p>
//                 </div>
//                 <div className='flex justify-end gap-3'>
//                   <button
//                     className='bg-gray-200 hover:bg-gray-300  text-sm text-gray-800 px-4 py-2 rounded-lg font-medium transition'
//                     onClick={() => setShowModal(false)}
//                   >
//                     Go Back
//                   </button>
//                   <button
//                     className='bg-red-500 text-sm hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition'
//                     onClick={confirmCancel}
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default TravelHistory;
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import authFetch from "../utils/authFetch";

export default function TravelHistory() {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [cancelTrip, setCancelTrip] = useState(null);

  // --------------------
  // Fetch bookings
  // --------------------
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await authFetch("/bookings/");
        const data = await response.json();

        const formatted = data.map((booking) => {
          const trip = booking.trip;
          const datetime = new Date(trip.departure_datetime);

          return {
            id: booking.id,
            from: trip.route.origin_park.name,
            fromCity: trip.route.origin_city?.name,
            to: trip.route.destination_park.name,
            toCity: trip.route.destination_city?.name,
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
            seats: booking.seat_count,
            price: `₦${Number(booking.price).toLocaleString()}`,
            bookingRef: booking.payment_reference,
            status: booking.status.toLowerCase(),
          };
        });

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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-700 mb-8 tracking-tight">
          Travel History
        </h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["all", "confirmed", "completed", "cancelled"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full text-sm font-medium shadow 
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
          <p className="text-center text-gray-500 mt-10">
            No trips found for this status.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredTrips.map((trip) => {
              // Determine badge style by status
              let badgeClasses = "px-3 py-1 text-xs rounded-full font-semibold ";
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
                  className="relative bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-6"
                >
                  {/* Status Badge */}
                  <span className={`absolute top-3 right-3 ${badgeClasses}`}>
                    {trip.status}
                  </span>

                  {/* Route + Reference */}
                  <div className="sm:flex sm:justify-between sm:items-start">
                    <div className="mb-4 sm:mb-0">
                      <h2 className="text-xl font-bold text-gray-800 mb-1">
                        {trip.from}{" "}
                        {trip.fromCity && (
                          <span className="text-sm text-gray-500">
                            ({trip.fromCity})
                          </span>
                        )}
                        <span className="mx-2 text-gray-400">→</span>
                        {trip.to}{" "}
                        {trip.toCity && (
                          <span className="text-sm text-gray-500">
                            ({trip.toCity})
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-gray-500">
                        Ref: <span className="font-mono">{trip.bookingRef}</span>
                      </p>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    <div className="flex items-center text-gray-700 text-sm">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      {trip.date}
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <FaClock className="mr-2 text-blue-500" />
                      {trip.time}
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <FaUser className="mr-2 text-blue-500" />
                      {trip.seats} seat{trip.seats > 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Price + Actions */}
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-xl font-bold text-gray-800">
                      {trip.price}
                    </span>

                    {trip.status === "confirmed" && (
                      <button
                        onClick={() => handleCancelClick(trip)}
                        className="px-4 py-2 rounded-md text-sm font-medium
                          border border-red-600 text-red-600
                          hover:bg-red-50 transition-colors
                          focus:outline-none"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancel Modal */}
        {showModal && cancelTrip && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md
                         transform transition-all duration-300 scale-100"
            >
              <h2 className="text-2xl font-bold text-red-600 mb-3">
                Cancel Trip
              </h2>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to cancel your trip from{" "}
                <strong>{cancelTrip.from}</strong> to{" "}
                <strong>{cancelTrip.to}</strong>?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md text-sm bg-gray-200 text-gray-700
                             hover:bg-gray-300 transition-colors
                             focus:outline-none"
                >
                  Close
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 rounded-md text-sm bg-red-600 text-white
                             hover:bg-red-700 transition-colors
                             focus:outline-none"
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
