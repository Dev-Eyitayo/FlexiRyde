// import { useState } from "react";
// import { BookingInput } from "../components/BookingInput";
// import { motion } from "framer-motion";
// import modify from "./../assets/modify.png";
// export default function ChangeBooking() {
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const [bookingRef, setBookingRef] = useState("");

//   const handleFetchBooking = () => {
//     // Simulate fetching booking details
//     setBookingDetails({
//       busOperator: "FlexiRyde Express",
//       departure: "Lagos",
//       destination: "Abuja",
//       date: "2025-04-10",
//       time: "08:30 AM",
//       seat: "3",
//       price: "₦15,000",
//     });
//   };

//   return (
//     <>
//       <div className='bg-gray-100/20 min-h-screen flex flex-col items-center p-6'>
//         <motion.h1
//           className='text-2xl font-semibold text-gray-700 mb-4'
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           Modify Your Booking
//         </motion.h1>

//         {/* Booking Reference Input */}
//         <div className='bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mb-6'>
//           <label className='text-gray-600 font-medium block mb-2'>
//             Enter Booking Reference:
//           </label>
//           <input
//             type='text'
//             value={bookingRef}
//             onChange={(e) => setBookingRef(e.target.value)}
//             placeholder='e.g. FXR-12345'
//             className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
//           />
//           <button
//             onClick={handleFetchBooking}
//             className='mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition'
//           >
//             Retrieve Booking
//           </button>
//         </div>

//         {/* Show Booking Details if Found */}
//         {bookingDetails && (
//           <motion.div
//             className='bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mb-6'
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.4 }}
//           >
//             <h2 className='text-lg font-semibold text-gray-700 mb-2'>
//               Current Booking Details
//             </h2>
//             <div className='grid grid-cols-2 gap-4 text-gray-600'>
//               <p>
//                 <strong>Bus Operator:</strong> {bookingDetails.busOperator}
//               </p>
//               <p>
//                 <strong>From:</strong> {bookingDetails.departure} →{" "}
//                 <strong>To:</strong> {bookingDetails.destination}
//               </p>
//               <p>
//                 <strong>Date:</strong> {bookingDetails.date}
//               </p>
//               <p>
//                 <strong>Time:</strong> {bookingDetails.time}
//               </p>
//               <p>
//                 <strong>Number of seats booked:</strong> {bookingDetails.seat}
//               </p>
//               <p>
//                 <strong>Price:</strong> {bookingDetails.price}
//               </p>
//             </div>
//           </motion.div>
//         )}

//         {/* Booking Input Component (Unchanged) */}
//         <div className='w-full flex flex-col items-center justify-center p-1 rounded-lg'>
//           {bookingDetails && <BookingInput submitType='Modify Booking' />}
//         </div>
//       </div>
//     </>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for redirection
import { BookingInput } from "../components/BookingInput";
import { motion } from "framer-motion";
import modify from "./../assets/modify.png";

export default function ChangeBooking() {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingRef, setBookingRef] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  const handleFetchBooking = () => {
    setBookingDetails({
      busOperator: "FlexiRyde Express",
      departure: "Lagos",
      destination: "Abuja",
      date: "2025-04-10",
      time: "08:30 AM",
      seat: "3",
      price: "₦15,000",
    });
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Booking Reference Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm z-50'>
          <motion.div
            className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className='text-lg font-semibold text-gray-700 mb-4'>
              Enter Booking Reference
            </h2>
            <input
              type='text'
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              placeholder='e.g. FXR-12345'
              className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
            <div className='flex justify-end mt-4'>
              <button
                onClick={() => navigate(-1)} // Go back to previous page
                className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2'
              >
                Cancel
              </button>
              <button
                onClick={handleFetchBooking}
                className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'
              >
                Retrieve Booking
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Page Content */}
      <div className='bg-gray-100/20 min-h-[700px] flex flex-col items-center p-3'>
        <motion.h1
          className='md:text-3xl text-2xl self-center text-gray-700 font-bold md:mb-10 mb-8'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Modify Your Booking
        </motion.h1>

        {/* Illustration + Booking Details */}
        <div className='w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start mb-6 gap-6'>
          {/* Illustration Image */}
          <div className='flex-shrink-1 h-78 md:w-80 lg:w-120'>
            <img
              src={modify}
              alt='Booking Illustration'
              className='object-contain h-full'
            />
          </div>

          {/* Booking Details (only if booking is retrieved) */}
          {bookingDetails && (
            <motion.div
              className='flex-1 bg-white shadow-md rounded-lg p-6 flex flex-col gap-3 justify-between h-full'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className='text-lg font-bold text-gray-700 mb-4'>
                Current Booking Details
              </h2>
              <div className='grid grid-cols-2 sm:grid-cols-2 gap-6 text-gray-600'>
                <p>
                  <strong>Bus Operator:</strong> {bookingDetails.busOperator}
                </p>
                <p>
                  <strong>From:</strong> {bookingDetails.departure} →{" "}
                  <strong>To:</strong> {bookingDetails.destination}
                </p>
                <p>
                  <strong>Date:</strong> {bookingDetails.date}
                </p>
                <p>
                  <strong>Time:</strong> {bookingDetails.time}
                </p>
                <p>
                  <strong>Number of seats booked:</strong> {bookingDetails.seat}
                </p>
                <p>
                  <strong>Price:</strong> {bookingDetails.price}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Booking Input Component (Unchanged) */}
        <div className='w-full flex flex-col items-center justify-center p-1 rounded-lg'>
          {bookingDetails && <BookingInput submitType='Modify Booking' />}
        </div>
      </div>
    </>
  );
}
