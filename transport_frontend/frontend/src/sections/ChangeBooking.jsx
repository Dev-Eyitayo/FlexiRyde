import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingInput } from "../components/BookingInput";
import { motion as Motion } from "framer-motion";
import modify from "./../assets/modify.png";
import { FiSearch, FiArrowLeft } from "react-icons/fi";

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
      {/* Enhanced Booking Reference Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm z-50'>
          <Motion.div
            className='bg-white p-6 rounded-xl shadow-xl w-full max-w-md'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex items-center mb-4'>
              <FiSearch className='text-blue-600 text-xl mr-2' />
              <h2 className='text-xl font-semibold text-gray-800'>
                Find Your Booking
              </h2>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Booking Reference Number
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder='e.g. FXR-12345'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
                <button
                  onClick={handleFetchBooking}
                  className='absolute right-2 top-2 text-blue-600 hover:text-blue-800'
                >
                  <FiSearch size={20} />
                </button>
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                Find your booking reference in your confirmation email
              </p>
            </div>

            <div className='flex justify-between mt-6'>
              <button
                onClick={() => navigate(-1)}
                className='flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition'
              >
                <FiArrowLeft className='mr-2' />
                Back
              </button>
              <button
                onClick={handleFetchBooking}
                className='flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
                disabled={!bookingRef.trim()}
              >
                Search Booking
                <FiSearch className='ml-2' />
              </button>
            </div>
          </Motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className='bg-gray-50/20 min-h-screen'>
        <div className='container mx-auto px-4 py-12'>
          <Motion.h1
            className='md:text-3xl text-2xl self-center text-gray-700 font-bold md:mb-10 mb-8'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Modify Your Booking
          </Motion.h1>

          {/* Illustration + Booking Details */}
          <div className='w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start mb-6 gap-6'>
            {/* Illustration Image */}
            <div className='flex-shrink-1 h-78 md:w-80 lg:w-120 self-center'>
              <img
                src={modify}
                alt='Booking Illustration'
                className='object-contain h-full'
              />
            </div>

            {/* Booking Details (only if booking is retrieved) */}
            {bookingDetails && (
              <Motion.div
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
                    <strong>Number of seats booked:</strong>{" "}
                    {bookingDetails.seat}
                  </p>
                  <p>
                    <strong>Price:</strong> {bookingDetails.price}
                  </p>
                </div>
              </Motion.div>
            )}
          </div>

          {/* Booking Input Component (Unchanged) */}
          <div className='w-full flex flex-col items-center justify-center p-1 rounded-lg'>
            {bookingDetails && <BookingInput submitType='Modify Booking' />}
          </div>
        </div>
      </div>
    </>
  );
}
