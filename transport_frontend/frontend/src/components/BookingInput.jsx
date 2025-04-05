import { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { getBusParks } from "../api"; // Adjust import path if needed
// import { AuthContext } from "../context/AuthContext";
import authFetch from "../utils/authFetch"; 
import { useNavigate } from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaPlus,
  FaMinus,
  FaClock,
} from "react-icons/fa";

export const BookingInput = ({ submitType, onClick }) => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [time, setTime] = useState("");

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  // Swap button: quickly swap origin/destination
  const swapRoute = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const dateRef = useRef(null);
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);
  const passengerInputRef = useRef(null);
  const passengerModalRef = useRef(null);

  // Parks + loading
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bus parks on mount
  useEffect(() => {
    const fetchParks = async () => {
      try {
        const data = await getBusParks();
        setParks(data); // data is e.g. [{id, name, city: {name}, ...}, ...]
      } catch (err) {
        console.error("❌ Could not load parks:", err.message);
      } finally {
        setLoading(false); // Must set this to false to show results
      }
    };

    fetchParks();
  }, []);

  // Close passenger / dropdown modals if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        passengerInputRef.current &&
        !passengerInputRef.current.contains(event.target) &&
        passengerModalRef.current &&
        !passengerModalRef.current.contains(event.target)
      ) {
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to group parks by city after filter
  const groupParksByCity = (query) => {
    const filtered = parks.filter((park) => {
      // If user typed 'Ibadan', show all parks where city is Ibadan
      // If user typed 'kuto', show Kuto Park
      return (
        park.name.toLowerCase().includes(query.toLowerCase()) ||
        park.city.name.toLowerCase().includes(query.toLowerCase())
      );
    });

    return filtered.reduce((acc, park) => {
      const cityName = park.city.name;
      if (!acc[cityName]) acc[cityName] = [];
      acc[cityName].push(park);
      return acc;
    }, {});
  };

  const handleCheckAvailability = async () => {
    const originPark = parks.find(p => `${p.name} (${p.city.name})` === from);
    const destinationPark = parks.find(p => `${p.name} (${p.city.name})` === to);
  
    if (!originPark || !destinationPark || !dateRef.current?.value) {
      alert("Please complete all fields.");
      return;
    }
    console.log("🔍 origin_id", originPark.id);
    console.log("🔍 destination_id", destinationPark.city.id);
    console.log("🔍 date", dateRef.current.value);

    try {
      const response = await authFetch(
        `/trips/search/?origin_id=${originPark.id}&destination_id=${destinationPark.city.id}&date=${dateRef.current.value}`,
        {
          method: "GET",
        }
      );
      
      const tripResults = await response.json();
  
  
      if (tripResults.length === 0) {
        alert("No trips found for that route and date.");
        return;
      }
  
      const selectedTrip = tripResults[0]; // For now, use first
  
      navigate("/check-availability", {
        state: {
          trip: selectedTrip,
          searchInfo: {
            from: originPark.name,
            to: destinationPark.city.name,
            date: dateRef.current.value,
          }
        }
      });
    } catch (error) {
      console.error("Trip search failed", error);
      if (error.response) {
        console.log("🔥 Server response:", error.response.data);
      }
      alert("Failed to search trips.");

    }
  };
  

  // Render grouped results for either from or to
  const renderGroupedDropdown = (query, setValue, setDropdown) => {
    if (loading) {
      return (
        <div className='p-3 text-center text-gray-500'>Loading parks...</div>
      );
    }

    const grouped = groupParksByCity(query);

    return Object.entries(grouped).map(([cityName, cityParks]) => (
      <div key={cityName}>
        <p className='px-3 py-1 font-semibold text-sm bg-gray-100 text-gray-700'>
          {cityName}
        </p>
        {cityParks.map((park) => (
          <div
            key={park.id}
            className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
            onClick={() => {
              // e.g. "Challenge Park (Ibadan)"
              setValue(`${park.name} (${park.city.name})`);
              setDropdown(false);
            }}
          >
            {park.name}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className='bg-gray-100 rounded-md p-3 px-4 mt-6 shadow-lg w-full max-w-7xl'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-center'>
        {/* FROM DROPDOWN */}
        <div className='relative w-full' ref={fromDropdownRef}>
          <div className='flex items-center p-3 rounded-md w-full border-0 bg-white'>
            <FaMapMarkerAlt className='text-gray-500 mr-3' />
            <input
              type='text'
              placeholder='Leaving from'
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                setShowFromDropdown(!showFromDropdown);
              }}
              className='w-full bg-transparent focus:outline-none cursor-pointer'
            />
          </div>

          <AnimatePresence>
            {showFromDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50 max-h-60 overflow-y-auto'
              >
                {renderGroupedDropdown(from, setFrom, setShowFromDropdown)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TO DROPDOWN */}
        <div className='relative w-full' ref={toDropdownRef}>
          <div className='flex items-center p-3 rounded-md w-full bg-white border-0'>
            <FaMapMarkerAlt className='text-gray-500 mr-3' />
            <input
              type='text'
              placeholder='Going to'
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                setShowToDropdown(!showToDropdown);
              }}
              className='w-full bg-transparent focus:outline-none cursor-pointer'
            />
          </div>

          <AnimatePresence>
            {showToDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50 max-h-60 overflow-y-auto'
              >
                {renderGroupedDropdown(to, setTo, setShowToDropdown)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Travel Date */}
        <div className='flex items-center border-0 p-3 rounded-md w-full bg-white'>
          <FaCalendarAlt className='text-gray-500 mr-3' />
          <input
            type='date'
            className='w-full bg-transparent focus:outline-none appearance-none'
            aria-label='Travel date'
            min={new Date().toISOString().split("T")[0]}
            ref={dateRef}
            onFocus={() => dateRef.current?.showPicker()}
          />
        </div>

        {/* Travel Time */}
        <div className='relative w-full'>
          <div className='flex items-center border-0 p-3 rounded-md w-full bg-white'>
            <FaClock className='text-gray-500 mr-3' />
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className='w-full pl-2 bg-transparent focus:outline-none appearance-none cursor-pointer'
              aria-label='Travel time'
            >
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i % 12 || 12;
                const period = i < 12 ? "AM" : "PM";
                const time = `${hour.toString().padStart(2, "0")}:00 ${period}`;
                return (
                  <option key={time} value={time}>
                    {time}
                  </option>
                );
              })}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Passenger Selection */}
        <div className='relative w-full'>
          <div
            ref={passengerInputRef}
            className='flex items-center border-0 p-3 rounded-md w-full bg-white cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              setShowPassengerModal((prev) => !prev);
            }}
          >
            <FaUser className='text-gray-500 mr-3' />
            <span>
              {passengers} Seat{passengers > 1 ? "s" : ""}
            </span>
          </div>

          <AnimatePresence>
            {showPassengerModal && (
              <motion.div
                ref={passengerModalRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50 p-4 flex items-center justify-between'
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className='p-2 bg-gray-200 rounded-full'
                  onClick={(e) => {
                    e.stopPropagation();
                    setPassengers(Math.max(1, passengers - 1));
                  }}
                >
                  <FaMinus />
                </button>
                <span className='text-lg font-semibold'>{passengers}</span>
                <button
                  className='p-2 bg-gray-200 rounded-full'
                  onClick={(e) => {
                    e.stopPropagation();
                    setPassengers(Math.min(24, passengers + 1));
                  }}
                >
                  <FaPlus />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button (Check Availability) */}
        <button
          className='bg-blue-600 text-white px-6 py-3 rounded-md w-full md:w-auto font-semibold hover:bg-blue-700 transition'
          onClick={handleCheckAvailability}
        >
          {submitType}
        </button>
      </div>
    </div>
  );
};
