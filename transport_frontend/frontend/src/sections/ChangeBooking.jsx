import { useState } from "react";
import { BookingInput } from "../components/BookingInput";
import { motion } from "framer-motion";

export default function ChangeBooking() {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingRef, setBookingRef] = useState("");

  const handleFetchBooking = () => {
    // Simulate fetching booking details
    setBookingDetails({
      busOperator: "FlexiRyde Express",
      departure: "Lagos",
      destination: "Abuja",
      date: "2025-04-10",
      time: "08:30 AM",
      seat: "A12",
      price: "₦15,000",
    });
  };

  return (
    <>
      <div className='bg-black/1 min-h-screen flex flex-col items-center justify-start p-6'>
        <motion.h1
          className='text-2xl font-semibold text-gray-700 mb-4'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Modify Your Booking
        </motion.h1>

        {/* Booking Reference Input */}
        <div className='bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mb-6'>
          <label className='text-gray-600 font-medium'>
            Enter Booking Reference:
          </label>
          <input
            type='text'
            value={bookingRef}
            onChange={(e) => setBookingRef(e.target.value)}
            placeholder='e.g. FXR-12345'
            className='w-full mt-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          <button
            onClick={handleFetchBooking}
            className='mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition'
          >
            Retrieve Booking
          </button>
        </div>

        {/* Show Booking Details if Found */}
        {bookingDetails && (
          <motion.div
            className='bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mb-6'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className='text-lg font-semibold text-gray-700'>
              Current Booking Details
            </h2>
            <p className='text-gray-600 mt-1'>
              <strong>Bus Operator:</strong> {bookingDetails.busOperator}
            </p>
            <p className='text-gray-600'>
              <strong>From:</strong> {bookingDetails.departure} →{" "}
              <strong>To:</strong> {bookingDetails.destination}
            </p>
            <p className='text-gray-600'>
              <strong>Date:</strong> {bookingDetails.date}
            </p>
            <p className='text-gray-600'>
              <strong>Time:</strong> {bookingDetails.time}
            </p>
            <p className='text-gray-600'>
              <strong>Seat No:</strong> {bookingDetails.seat}
            </p>
            <p className='text-gray-600'>
              <strong>Price:</strong> {bookingDetails.price}
            </p>

            <h3 className='mt-4 text-lg font-medium text-gray-700'>
              Modify Booking
            </h3>
          </motion.div>
        )}

        {/* Booking Input Component */}
        <div className='w-full flex flex-col items-center justify-center p-1 rounded-lg'>
          {bookingDetails && <BookingInput submitType='Modify Booking' />}
        </div>
      </div>
    </>
  );
}
