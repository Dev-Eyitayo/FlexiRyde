import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SeatAvailability() {
  const location = useLocation();

  // Dummy data if location.state is empty
  const dummyTravelData = {
    from: "Lagos",
    to: "Abuja",
    date: "2025-04-10",
    time: "10:00 AM",
    bookedSeats: 3,
  };

  const { from, to, date, time, bookedSeats } =
    location.state || dummyTravelData;

  const totalSeats = 24;
  const takenSeats = 6;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const basePrice = 1500;
    const demandFactor = 1 + takenSeats / totalSeats;
    setPrice(basePrice * demandFactor);
  }, [takenSeats]);

  // Handle seat selection
  const toggleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else if (selectedSeats.length < bookedSeats) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      toast.error(`You booked just ${bookedSeats} seats.`);
    }
  };

  // Handle proceed button click
  const handleProceed = () => {
    if (selectedSeats.length < bookedSeats) {
      toast.error(`Please select exactly ${bookedSeats} seats to proceed.`);
      return;
    }
    alert(`Proceeding to payment for seats: ${selectedSeats.join(", ")}`);
  };

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4 lg:px-8'>
      {/* Toast Notification */}
      <ToastContainer position='top-right' autoClose={3000} />

      {/* Header */}
      <motion.h1
        className='text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Select Your Seats
      </motion.h1>

      {/* Travel Details */}
      <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mb-6'>
        <h2 className='text-lg font-semibold text-gray-700 mb-3'>
          Travel Details
        </h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-600 text-sm md:text-base'>
          <p>
            <strong>From:</strong> {from}
          </p>
          <p>
            <strong>To:</strong> {to}
          </p>
          <p>
            <strong>Date:</strong> {date}
          </p>
          <p>
            <strong>Time:</strong> {time}
          </p>
          <p>
            <strong>Seats to Book:</strong> {bookedSeats}
          </p>
        </div>
      </div>

      {/* Seat Status Legend */}
      <div className='flex flex-wrap justify-center gap-4 bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mb-4'>
        <div className='flex items-center gap-2'>
          <div className='h-5 w-5 bg-green-500 rounded-md'></div>
          <span className='text-sm md:text-base'>Available</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-5 w-5 bg-red-500 rounded-md'></div>
          <span className='text-sm md:text-base'>Unavailable</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-5 w-5 bg-yellow-500 rounded-md'></div>
          <span className='text-sm md:text-base'>Selected</span>
        </div>
      </div>

      {/* Seat Selection */}
      <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mb-6'>
        <h3 className='text-lg font-semibold text-gray-700 mb-3'>
          Seat Availability
        </h3>
        <div className='grid grid-cols-4 sm:grid-cols-6 gap-3'>
          {Array.from({ length: totalSeats }).map((_, index) => {
            const seatNumber = index + 1;
            const isTaken = seatNumber <= takenSeats;
            const isSelected = selectedSeats.includes(seatNumber);

            return (
              <motion.div
                key={seatNumber}
                onClick={() => !isTaken && toggleSeatSelection(seatNumber)}
                className={`h-12 w-12 flex justify-center items-center rounded-lg text-white font-semibold cursor-pointer transition
                  ${
                    isTaken
                      ? "bg-red-500 cursor-not-allowed"
                      : isSelected
                        ? "bg-yellow-500"
                        : "bg-green-500 hover:bg-green-600"
                  }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02, duration: 0.3 }}
              >
                {seatNumber}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pricing Information */}
      <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mb-6'>
        <h3 className='text-lg font-semibold text-gray-700 mb-3'>
          Total Price
        </h3>
        <p className='text-2xl font-bold text-gray-800'>
          ₦{(price * selectedSeats.length).toLocaleString()}
        </p>
      </div>

      {/* Proceed to Payment */}
      <div className='w-full max-w-3xl'>
        <button
          onClick={handleProceed}
          className={`py-3 px-6 rounded-lg w-full text-lg font-semibold transition duration-300
            ${
              selectedSeats.length === bookedSeats
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          disabled={selectedSeats.length !== bookedSeats}
        >
          {selectedSeats.length === bookedSeats
            ? `Proceed with Seats: ${selectedSeats.join(", ")}`
            : "Select Exact Seats to Continue"}
        </button>
      </div>
    </div>
  );
}
