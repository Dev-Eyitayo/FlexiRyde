// import { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion as Motion } from "framer-motion";
// import { FiSearch, FiArrowLeft, FiCalendar, FiInfo } from "react-icons/fi";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function ChangeBooking() {
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const [bookingRef, setBookingRef] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [newDate, setNewDate] = useState("");
//   const [newTime, setNewTime] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // Dummy seat availability data
//   const timeSlots = {
//     "2025-04-10": {
//       "08:00 AM": { availableSeats: 12 },
//       "10:00 AM": { availableSeats: 8 },
//       "12:00 PM": { availableSeats: 16 },
//     },
//     "2025-04-11": {
//       "09:00 AM": { availableSeats: 15 },
//       "11:00 AM": { availableSeats: 10 },
//       "01:00 PM": { availableSeats: 20 },
//     },
//   };

//   const handleFetchBooking = () => {
//     setBookingDetails({
//       busPark: "Owode Park",
//       departure: "Lagos",
//       destination: "Abuja",
//       date: "2025-04-10",
//       time: "08:00 AM",
//       seat: 3,
//       price: "₦15,000",
//     });
//     setIsModalOpen(false);
//   };

//   const handleDateChange = (e) => {
//     setNewDate(e.target.value);
//     setNewTime("");
//     setError("");
//   };

//   const handleTimeChange = (e) => {
//     const selectedTime = e.target.value;
//     const availableSeats =
//       timeSlots[newDate]?.[selectedTime]?.availableSeats || 0;

//     if (availableSeats < bookingDetails.seat) {
//       setError(
//         `Only ${availableSeats} seats available at ${selectedTime}. Please choose another time.`
//       );
//       setNewTime("");
//     } else {
//       setError("");
//       setNewTime(selectedTime);
//     }
//   };

//   const dateInputRef = useRef(null);
//   const handleDateClick = () => {
//     dateInputRef.current.showPicker();
//   };

//   const handleSubmit = () => {
//     if (!newDate || !newTime) {
//       setError("Please select both date and time");
//       toast.error("Please select both date and time");
//       return;
//     }
//     toast.success(`Booking updated to ${newDate} at ${newTime}`);
//   };

//   return (
//     <>
//       {/* Enhanced Booking Reference Modal */}
//       {isModalOpen && (
//         <div className='fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm z-50'>
//           <Motion.div
//             className='bg-white p-6 rounded-xl shadow-xl w-full max-w-md'
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className='flex items-center mb-4'>
//               <FiSearch className='text-blue-600 text-xl mr-2' />
//               <h2 className='text-xl font-semibold text-gray-800'>
//                 Find Your Booking
//               </h2>
//             </div>

//             <div className='mb-4'>
//               <label className='block text-sm font-medium text-gray-700 mb-1'>
//                 Booking Reference Number
//               </label>
//               <div className='relative'>
//                 <input
//                   type='text'
//                   value={bookingRef}
//                   onChange={(e) => setBookingRef(e.target.value)}
//                   placeholder='e.g. FXR-12345'
//                   className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-0 focus:border-blue-500'
//                 />
//                 <button
//                   onClick={handleFetchBooking}
//                   className='absolute right-2 top-2 text-blue-600 hover:text-blue-800'
//                 >
//                   <FiSearch size={20} className='self-center mt-1.5' />
//                 </button>
//               </div>
//               <p className='text-xs text-gray-500 mt-1'>
//                 Find your booking reference in the travel history page
//               </p>
//             </div>

//             <div className='flex justify-between mt-6'>
//               <button
//                 onClick={() => navigate(-1)}
//                 className='flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition'
//               >
//                 <FiArrowLeft className='mr-2' />
//                 Back
//               </button>
//               <button
//                 onClick={handleFetchBooking}
//                 className='flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
//                 disabled={!bookingRef.trim()}
//               >
//                 Search Booking
//                 <FiSearch className='ml-2' />
//               </button>
//             </div>
//           </Motion.div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className='bg-gray-50/20 min-h-screen'>
//         <div className='container mx-auto px-4 py-12 flex flex-col items-center'>
//           <Motion.h1
//             className='md:text-3xl text-2xl self-center text-gray-700 font-bold mb-6'
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             Modify Your Booking
//           </Motion.h1>

//           {/* Info Note */}
//           {bookingDetails && (
//             <div className='w-full max-w-4xl mx-auto mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg text-sm text-blue-800 flex items-start'>
//               <FiInfo className='mr-2 mt-0.5 flex-shrink-0' />
//               <div>
//                 <p className='font-medium'>Important Note:</p>
//                 <p>
//                   To change the number of seats or travel destination, please
//                   cancel this booking and request a refund on the Travel History
//                   page, then create a new booking.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Booking Details */}
//           {bookingDetails && (
//             <div className='w-full max-w-4xl mx-auto'>
//               <Motion.div
//                 className='bg-white shadow-md rounded-lg p-6 mb-8'
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <h2 className='text-xl font-semibold text-gray-800 mb-6 border-b pb-4'>
//                   Current Booking Details
//                 </h2>
//                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                   <div className='space-y-3'>
//                     <p className='flex justify-between'>
//                       <span className='text-gray-600'>Bus Park:</span>
//                       <span className='font-medium'>
//                         {bookingDetails.busPark}
//                       </span>
//                     </p>
//                     <p className='flex justify-between'>
//                       <span className='text-gray-600'>Route:</span>
//                       <span className='font-medium'>
//                         {bookingDetails.departure} →{" "}
//                         {bookingDetails.destination}
//                       </span>
//                     </p>
//                     <p className='flex justify-between'>
//                       <span className='text-gray-600'>Date:</span>
//                       <span className='font-medium'>{bookingDetails.date}</span>
//                     </p>
//                   </div>
//                   <div className='space-y-3'>
//                     <p className='flex justify-between'>
//                       <span className='text-gray-600'>Time:</span>
//                       <span className='font-medium'>{bookingDetails.time}</span>
//                     </p>
//                     <p className='flex justify-between'>
//                       <span className='text-gray-600'>Seats Booked:</span>
//                       <span className='font-medium'>{bookingDetails.seat}</span>
//                     </p>
//                     <p className='flex justify-between'>
//                       <span className='text-gray-600'>Total Price:</span>
//                       <span className='font-medium'>
//                         {bookingDetails.price}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </Motion.div>
//             </div>
//           )}

//           {/* Date and Time Selection */}
//           {bookingDetails && (
//             <div className='w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8'>
//               <h2 className='text-xl font-semibold text-gray-800 mb-6'>
//                 Change Travel Date & Time
//               </h2>

//               <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//                 {/* Date Selection */}
//                 <div className='flex flex-col'>
//                   <label className='text-gray-600 mb-2'>New Travel Date</label>
//                   <div className='relative' onClick={handleDateClick}>
//                     <input
//                       type='date'
//                       ref={dateInputRef}
//                       min={new Date().toISOString().split("T")[0]}
//                       value={newDate}
//                       onChange={handleDateChange}
//                       className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 opacity-0 absolute'
//                     />
//                     <div className='p-3 border border-gray-300 rounded-lg flex items-center justify-between'>
//                       <span>{newDate || "Select a date"}</span>
//                       <FiCalendar className='text-gray-500' />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Time Selection */}
//                 <div className='flex flex-col'>
//                   <label className='text-gray-600 mb-2'>New Travel Time</label>
//                   <select
//                     value={newTime}
//                     onChange={handleTimeChange}
//                     className='p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
//                   >
//                     <option value=''>Select a time</option>
//                     {newDate && timeSlots[newDate] ? (
//                       Object.entries(timeSlots[newDate]).map(
//                         ([time, { availableSeats }]) => (
//                           <option
//                             key={time}
//                             value={time}
//                             disabled={availableSeats < bookingDetails.seat}
//                           >
//                             {time} ({availableSeats} seats available)
//                           </option>
//                         )
//                       )
//                     ) : (
//                       <option disabled>Select a date first</option>
//                     )}
//                   </select>
//                 </div>
//               </div>

//               {error && (
//                 <div className='mt-4 text-red-600 text-sm'>{error}</div>
//               )}

//               <div className='mt-8'>
//                 <button
//                   onClick={handleSubmit}
//                   className='w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition'
//                 >
//                   Confirm Changes
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <ToastContainer
//         position='top-right'
//         autoClose={1500}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         // toastClassName='!bg-white !text-gray-800 !shadow-md'
//         // progressClassName='!bg-red-500'
//       />
//     </>
//   );
// }



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
        setError("This booking has already expired. Please create a new booking.");
      } else {
        setBooking(data);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        const validTrips = data.filter((trip) => trip.available_seats >= booking.seats);
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
        toast.success("Booking updated successfully!");
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      {!booking && (
        <div className="bg-white shadow-md rounded-xl p-6 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            🔍 Find Your Booking
          </h2>
          <form onSubmit={handleSearch}>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Booking Reference Number
            </label>
            <input
              type="text"
              placeholder="e.g. REF-20250426-DUGBE65-XYZ"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 mb-3"
            />
            <p className="text-xs text-gray-500 mb-4">
              Find your booking reference in the travel history page
            </p>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Searching..." : "Search Booking 🔍"}
            </button>
          </form>
          {error && (
            <p className="text-red-600 text-sm mt-4 font-medium text-center">{error}</p>
          )}
        </div>
      )}

      {booking && (
        <div>
          {/* Note */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
            <p className="text-sm text-blue-800 font-medium">
              <strong>Important Note:</strong> <br />
              To change the number of seats or travel destination, please cancel this
              booking and request a refund on the Travel History page, then create a new booking.
            </p>
          </div>

          {/* Booking Info */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Current Booking Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <strong>Bus Park:</strong> {booking.trip.route.origin_park.name}
              </div>
              <div>
                <strong>Time:</strong>{" "}
                {new Date(booking.trip.departure_datetime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div>
                <strong>Route:</strong>{" "}
                {booking.trip.route.origin_city.name} → {booking.trip.route.destination_city.name}
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
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Change Travel Date & Time</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Date Picker */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  New Travel Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border rounded-lg shadow-sm"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>

              {/* Time Select */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
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
                      {new Date(trip.departure_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      — ₦{trip.seat_price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              Confirm Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
