import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaPlus,
  FaMinus,
  FaClock,
} from "react-icons/fa";

const parks = [
  "Jibowu Terminal",
  "Berger Park",
  "Oshodi Park",
  "Ibadan Terminal",
  "Abuja Central Park",
];

export const BookingInput = ({ submitType, onClick }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [time, setTime] = useState(""); // State for storing the travel time
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  const dateRef = useRef(null);
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Close modals when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowPassengerModal(false);
      }
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target)
      ) {
        setShowFromDropdown(false);
      }
      if (
        toDropdownRef.current &&
        !toDropdownRef.current.contains(event.target)
      ) {
        setShowToDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='bg-gray-100 rounded-md p-3 px-4 mt-6 shadow-lg w-full max-w-7xl '>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-center'>
        {/* Leaving From */}
        <div className='relative w-full' ref={fromDropdownRef}>
          <div
            className='flex items-center p-3 rounded-md w-full border-0 bg-white cursor-pointer'
            onClick={() => setShowFromDropdown(!showFromDropdown)}
          >
            <FaMapMarkerAlt className='text-gray-500 mr-3' />
            <input
              type='text'
              placeholder='Leaving from'
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => setShowFromDropdown(true)}
              className='w-full bg-transparent focus:outline-none'
            />
          </div>

          {/* Dropdown Suggestions */}
          <AnimatePresence>
            {showFromDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50'
              >
                {parks
                  .filter((park) =>
                    park.toLowerCase().includes(from.toLowerCase())
                  )
                  .map((park, index) => (
                    <div
                      key={index}
                      className='p-2 hover:bg-gray-200 cursor-pointer'
                      onClick={() => {
                        setFrom(park);
                        setShowFromDropdown(false);
                      }}
                    >
                      {park}
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Going To */}
        <div className='relative w-full' ref={toDropdownRef}>
          <div
            className='flex items-center p-3 rounded-md w-full bg-white border-0 cursor-pointer'
            onClick={() => setShowToDropdown(!showToDropdown)}
          >
            <FaMapMarkerAlt className='text-gray-500 mr-3' />
            <input
              type='text'
              placeholder='Going to'
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setShowToDropdown(true)}
              className='w-full bg-transparent focus:outline-none'
            />
          </div>

          {/* Dropdown Suggestions */}
          <AnimatePresence>
            {showToDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50'
              >
                {parks
                  .filter((park) =>
                    park.toLowerCase().includes(to.toLowerCase())
                  )
                  .map((park, index) => (
                    <div
                      key={index}
                      className='p-2 hover:bg-gray-200 cursor-pointer'
                      onClick={() => {
                        setTo(park);
                        setShowToDropdown(false);
                      }}
                    >
                      {park}
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Travel Date */}
        <div className='flex items-center border-0 p-3 rounded-md w-full bg-white'>
          <FaCalendarAlt className='text-gray-500 mr-3' />
          <input
            type='date'
            ref={dateRef}
            className='w-full bg-transparent focus:outline-none appearance-none'
            aria-label='Travel date'
            min={new Date().toISOString().split("T")[0]} // Prevent past dates
            onFocus={() => dateRef.current?.showPicker()} // Auto open calendar
          />
        </div>

        {/* Travel Time */}
        <div className='flex items-center border-0 p-3 rounded-md w-full bg-white'>
          <FaClock className='text-gray-500 mr-3' />
          <input
            type='time'
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className='w-full bg-transparent focus:outline-none appearance-none'
            aria-label='Travel time'
          />
        </div>

        {/* Passenger Selection */}
        <div className='relative w-full'>
          <div
            className='flex items-center border-0 p-3 rounded-md w-full bg-white cursor-pointer'
            onClick={() => setShowPassengerModal(true)}
          >
            <FaUser className='text-gray-500 mr-3' />
            <span>
              {passengers} Seat{passengers > 1 ? "s" : ""}
            </span>
          </div>

          {/* Passenger Modal */}
          <AnimatePresence>
            {showPassengerModal && (
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50 p-4 flex items-center justify-between'
              >
                <button
                  className='p-2 bg-gray-200 rounded-full'
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                >
                  <FaMinus />
                </button>
                <span className='text-lg font-semibold'>{passengers}</span>
                <button
                  className='p-2 bg-gray-200 rounded-full'
                  onClick={() => setPassengers(Math.min(24, passengers + 1))}
                >
                  <FaPlus />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <button
          className='bg-blue-600 text-white px-6 py-3 rounded-md w-full md:w-auto font-semibold hover:bg-blue-700 transition'
          onClick={onClick}
        >
          {submitType}
        </button>
      </div>
    </div>
  );
};
