import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function SeatAvailability() {
  const location = useLocation();
  const { from, to, date, time } = location.state || {}; // Get travel details passed from previous page

  const totalSeats = 24; // Example total seats on a bus
  const [takenSeats, setTakenSeats] = useState(
    Math.floor(Math.random() * totalSeats)
  ); // Random taken seats
  const [availableSeats, setAvailableSeats] = useState(totalSeats - takenSeats);
  const [price, setPrice] = useState(0);

  // Simulate fetching seat data
  useEffect(() => {
    // In a real-world scenario, here you would fetch this data from your backend
    setTakenSeats(Math.floor(Math.random() * totalSeats)); // Randomly assigning taken seats for demo
    setAvailableSeats(totalSeats - takenSeats);

    // Calculate the price based on certain factors (e.g., distance, demand, etc.)
    const basePrice = 1000; // Base price for the ride
    const demandFactor = 1 + takenSeats / totalSeats; // Price increases with demand
    setPrice(basePrice * demandFactor);
  }, [takenSeats]);

  return (
    <div className='bg-gray-100/20 min-h-screen flex flex-col items-center justify-start p-6'>
      <motion.h1
        className='text-3xl font-semibold text-gray-700 mb-6'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Seat Availability
      </motion.h1>

      <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mb-6'>
        <motion.div
          className='flex justify-between items-center mb-4'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className='text-xl font-semibold text-gray-700'>
            Travel Details
          </h2>
        </motion.div>

        <motion.div
          className='flex justify-between mb-6'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className='text-gray-600'>
            <strong>From:</strong> {from}
          </p>
          <p className='text-gray-600'>
            <strong>To:</strong> {to}
          </p>
          <p className='text-gray-600'>
            <strong>Date:</strong> {date}
          </p>
          <p className='text-gray-600'>
            <strong>Time:</strong> {time}
          </p>
        </motion.div>

        {/* Seat Availability Display */}
        <motion.div
          className='bg-blue-100 p-6 rounded-lg shadow-lg'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-700'>
              Seat Availability
            </h3>
            <div className='flex space-x-2'>
              <div className='text-sm text-gray-600'>
                <strong>Available Seats:</strong> {availableSeats}
              </div>
              <div className='text-sm text-gray-600'>
                <strong>Taken Seats:</strong> {takenSeats}
              </div>
            </div>
          </div>

          {/* Seat Map */}
          <div className='grid grid-cols-6 gap-4'>
            {Array.from({ length: totalSeats }).map((_, index) => (
              <motion.div
                key={index}
                className={`h-10 w-10 rounded-lg ${
                  index < takenSeats ? "bg-red-500" : "bg-green-500"
                } flex justify-center items-center text-white`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02, duration: 0.3 }}
              >
                {index + 1}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Price Display */}
      <motion.div
        className='bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mb-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-700'>Price</h3>
        </div>
        <div className='text-xl font-semibold text-gray-700 mb-4'>
          <strong>Price:</strong> ₦{price.toLocaleString()}
        </div>
      </motion.div>

      {/* Proceed to Payment Button */}
      <motion.div
        className='bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => alert("Proceeding to payment...")}
          className='bg-green-600 text-white py-2 px-6 rounded-md w-full hover:bg-green-700 transition'
        >
          Proceed to Payment
        </button>
      </motion.div>
    </div>
  );
}
