import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function SeatAvailability() {
  const location = useLocation();
  const { from, to, date, time, bookedSeats } = location.state || {}; // Added bookedSeats

  const totalSeats = 24;
  const [takenSeats, setTakenSeats] = useState(
    Math.floor(Math.random() * totalSeats)
  );
  const [seatsRemaining, setSeatsRemaining] = useState(totalSeats - takenSeats);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    setTakenSeats(Math.floor(Math.random() * totalSeats));
    setSeatsRemaining(totalSeats - takenSeats);

    const basePrice = 1000;
    const demandFactor = 1 + takenSeats / totalSeats;
    setPrice(basePrice * demandFactor);
  }, [takenSeats]);

  return (
    <div className='bg-gray-50 min-h-screen flex flex-col items-center p-6'>
      <motion.h1
        className='md:text-3xl text-2xl font-bold text-gray-800 mb-6'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Seat Availability
      </motion.h1>

      <div className='bg-white shadow-xl rounded-xl p-6 w-full max-w-3xl mb-6'>
        <motion.div
          className='mb-4 border-b pb-4'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className='md:text-xl text-lg font-semibold text-gray-700'>
            Travel Details
          </h2>
        </motion.div>

        <motion.div
          className='grid grid-cols-2 gap-4 text-gray-600'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
            <strong>Seats Booked:</strong> {bookedSeats || 0}
          </p>
        </motion.div>
      </div>

      <motion.div
        className='bg-blue-50 p-6 rounded-xl shadow-lg w-full max-w-3xl mb-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className='md:text-xl text-lg font-semibold text-gray-700 mb-4'>
          Seat Availability
        </h3>
        <div className='flex justify-between text-gray-600 mb-4 md:text-base text-sm'>
          <p>
            <strong>Seats Remaining:</strong> {seatsRemaining}
          </p>
          <p>
            <strong>Taken Seats (plus yours):</strong> {takenSeats}
          </p>
        </div>

        <div className='grid grid-cols-6 gap-3'>
          {Array.from({ length: totalSeats }).map((_, index) => (
            <motion.div
              key={index}
              className={`h-10 w-10 flex justify-center items-center rounded-md text-white font-semibold ${
                index < takenSeats ? "bg-red-500" : "bg-green-500"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
            >
              {index + 1}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className='bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl mb-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className='text-xl font-semibold text-gray-700 mb-4'>Price</h3>
        <p className='text-2xl font-bold text-gray-800'>
          ₦{price.toLocaleString()}
        </p>
      </motion.div>

      <motion.div
        className='bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => alert("Proceeding to payment...")}
          className='bg-green-600 text-white py-3 px-6 rounded-md w-full text-lg font-semibold hover:bg-green-700 transition duration-300'
        >
          Proceed to Payment
        </button>
      </motion.div>
    </div>
  );
}
