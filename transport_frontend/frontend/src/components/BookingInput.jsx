import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBusParks } from "../api";
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

export const BookingInput = ({ submitType }) => {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [passengers, setPassengers] = useState(1);

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  const dateRef = useRef(null);
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);
  const passengerInputRef = useRef(null);
  const passengerModalRef = useRef(null);

  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const data = await getBusParks();
        setParks(data);
      } catch (err) {
        console.error("❌ Could not load parks:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParks();
  }, []);

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

  const groupParksByCity = (query) => {
    const filtered = parks.filter((park) => {
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
    if (!selectedFrom || !selectedTo || !dateRef.current?.value) {
      alert("Please complete all fields.");
      return;
    }

    const origin_id = selectedFrom.id;
    const destination_id = selectedTo.city.id;
    const travel_date = dateRef.current.value;

    try {
      const response = await authFetch(
        `/trips/search/?origin_id=${origin_id}&destination_id=${destination_id}&date=${travel_date}`,
        { method: "GET" }
      );

      const tripResults = await response.json();

      if (tripResults.length === 0) {
        alert("No trips found for that route and date.");
        return;
      }

      const selectedTrip = tripResults[0];

      navigate("/check-availability", {
        state: {
          trip: selectedTrip,
          searchInfo: {
            from: selectedFrom.name,
            to: selectedTo.city.name,
            date: travel_date,
            passengers,
          },
        },
      });
    } catch (error) {
      console.error("Trip search failed", error);
      alert("Failed to search trips.");
    }
  };

  const renderGroupedDropdown = (query, setValue, setDropdown, setSelected) => {
    if (loading) {
      return (
        <div className='p-3 text-center text-gray-500'>Loading parks...</div>
      );
    }

    const grouped = groupParksByCity(query);

    return Object.entries(grouped).map(([cityName, cityParks]) => (
      <div key={cityName}>
        <p className='px-4 py-2 font-medium text-sm bg-gray-50 text-gray-600 sticky top-0'>
          {cityName}
        </p>
        {cityParks.map((park) => (
          <div
            key={park.id}
            className='px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0'
            onClick={() => {
              setValue(`${park.name} (${park.city.name})`);
              setSelected(park);
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
    <div className='bg-white rounded-xl p-4 mt-6 shadow-lg w-full border border-gray-200'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
        {/* FROM DROPDOWN */}
        <div className='relative md:col-span-3' ref={fromDropdownRef}>
          <div className='relative'>
            <div className='flex items-center p-3 rounded-lg w-full bg-gray-50 border border-gray-300 hover:border-blue-500 transition-colors'>
              <FaMapMarkerAlt className='text-blue-500 mr-3' />
              <input
                type='text'
                placeholder='Leaving from'
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFromDropdown(!showFromDropdown);
                }}
                className='w-full bg-transparent focus:outline-none cursor-pointer placeholder-gray-500'
              />
            </div>
          </div>

          <AnimatePresence>
            {showFromDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className='absolute left-0 right-0 bg-white shadow-xl rounded-lg mt-1 z-50 max-h-60 overflow-y-auto border border-gray-200'
              >
                {renderGroupedDropdown(
                  from,
                  setFrom,
                  setShowFromDropdown,
                  setSelectedFrom
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TO DROPDOWN */}
        <div className='relative md:col-span-3' ref={toDropdownRef}>
          <div className='flex items-center p-3 rounded-lg w-full bg-gray-50 border border-gray-300 hover:border-blue-500 transition-colors'>
            <FaMapMarkerAlt className='text-blue-500 mr-3' />
            <input
              type='text'
              placeholder='Going to'
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                setShowToDropdown(!showToDropdown);
              }}
              className='w-full bg-transparent focus:outline-none cursor-pointer placeholder-gray-500'
            />
          </div>

          <AnimatePresence>
            {showToDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className='absolute left-0 right-0 bg-white shadow-xl rounded-lg mt-1 z-50 max-h-60 overflow-y-auto border border-gray-200'
              >
                {renderGroupedDropdown(
                  to,
                  setTo,
                  setShowToDropdown,
                  setSelectedTo
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Travel Date */}
        <div className='flex items-center p-3 rounded-lg w-full bg-gray-50 border border-gray-300 hover:border-blue-500 transition-colors md:col-span-2'>
          <FaCalendarAlt className='text-blue-500 mr-3' />
          <input
            type='date'
            className='w-full bg-transparent focus:outline-none appearance-none text-gray-700'
            min={new Date().toISOString().split("T")[0]}
            ref={dateRef}
            onFocus={() => dateRef.current?.showPicker()}
          />
        </div>

        {/* Number of Passengers */}
        <div className='relative md:col-span-2'>
          <div
            ref={passengerInputRef}
            className='flex flex-nowrap items-center p-3 rounded-lg w-full bg-gray-50 border border-gray-300 hover:border-blue-500 transition-colors cursor-pointer'
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
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className='absolute left-0 right-0 bg-white shadow-xl rounded-lg mt-1 z-50 p-4 flex items-center justify-between border border-gray-200'
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className='p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors'
                  onClick={(e) => {
                    e.stopPropagation();
                    setPassengers(Math.max(1, passengers - 1));
                  }}
                >
                  <FaMinus />
                </button>
                <span className='text-lg font-semibold'>{passengers}</span>
                <button
                  className='p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors'
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

        {/* Submit Button */}
        <button
          className='bg-blue-600 text-white py-3 rounded-md w-full font-semibold hover:bg-blue-700 transition h-full md:col-span-2'
          onClick={handleCheckAvailability}
        >
          {submitType}
        </button>
      </div>
    </div>
  );
};
