import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBusParks } from "../api"; // Adjust import path if needed
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaPlus,
  FaMinus,
  FaClock,
} from "react-icons/fa";

export const BookingInput = ({ submitType, onClick }) => {
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
  const modalRef = useRef(null);

  // Parks + loading
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bus parks on mount
  useEffect(() => {
    const fetchParks = async () => {
      try {
        const data = await getBusParks();
        setParks(data);  // data is e.g. [{id, name, city: {name}, ...}, ...]
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

  // Render grouped results for either from or to
  const renderGroupedDropdown = (query, setValue, setDropdown) => {
    if (loading) {
      return (
        <div className="p-3 text-center text-gray-500">
          Loading parks...
        </div>
      );
    }

    const grouped = groupParksByCity(query);

    return Object.entries(grouped).map(([cityName, cityParks]) => (
      <div key={cityName}>
        <p className="px-3 py-1 font-semibold text-sm bg-gray-100 text-gray-700">
          {cityName}
        </p>
        {cityParks.map((park) => (
          <div
            key={park.id}
            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
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
    <div className="bg-gray-100 rounded-md p-3 px-4 mt-6 shadow-lg w-full max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-center">
        
        {/* FROM DROPDOWN */}
        <div className="relative w-full" ref={fromDropdownRef}>
          <div
            className="flex items-center p-3 rounded-md w-full border-0 bg-white cursor-pointer"
            onClick={() => setShowFromDropdown(!showFromDropdown)}
          >
            <FaMapMarkerAlt className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Leaving from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => setShowFromDropdown(true)}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          <AnimatePresence>
            {showFromDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50 max-h-60 overflow-y-auto"
              >
                {renderGroupedDropdown(from, setFrom, setShowFromDropdown)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TO DROPDOWN */}
        <div className="relative w-full" ref={toDropdownRef}>
          <div
            className="flex items-center p-3 rounded-md w-full bg-white border-0 cursor-pointer"
            onClick={() => setShowToDropdown(!showToDropdown)}
          >
            <FaMapMarkerAlt className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Going to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setShowToDropdown(true)}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          <AnimatePresence>
            {showToDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50 max-h-60 overflow-y-auto"
              >
                {renderGroupedDropdown(to, setTo, setShowToDropdown)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Travel Date */}
        <div className="flex items-center border-0 p-3 rounded-md w-full bg-white">
          <FaCalendarAlt className="text-gray-500 mr-3" />
          <input
            type="date"
            className="w-full bg-transparent focus:outline-none appearance-none"
            aria-label="Travel date"
            min={new Date().toISOString().split("T")[0]}
            ref={dateRef}
            onFocus={() => dateRef.current?.showPicker()}
          />
        </div>

        {/* Travel Time */}
        <div
          className="flex items-center border-0 p-3 rounded-md w-full bg-white cursor-pointer"
          onClick={() => document.getElementById("travel-time")?.showPicker()}
        >
          <FaClock className="text-gray-500 mr-3" />
          <input
            type="time"
            id="travel-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-transparent focus:outline-none appearance-none cursor-pointer"
            aria-label="Travel time"
            onFocus={(e) => e.target.showPicker()}
          />
        </div>

        {/* Passenger Selection */}
        <div className="relative w-full">
          <div
            className="flex items-center border-0 p-3 rounded-md w-full bg-white cursor-pointer"
            onClick={() => setShowPassengerModal(true)}
          >
            <FaUser className="text-gray-500 mr-3" />
            <span>
              {passengers} Seat{passengers > 1 ? "s" : ""}
            </span>
          </div>

          <AnimatePresence>
            {showPassengerModal && (
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50 p-4 flex items-center justify-between"
              >
                <button
                  className="p-2 bg-gray-200 rounded-full"
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                >
                  <FaMinus />
                </button>
                <span className="text-lg font-semibold">{passengers}</span>
                <button
                  className="p-2 bg-gray-200 rounded-full"
                  onClick={() => setPassengers(Math.min(24, passengers + 1))}
                >
                  <FaPlus />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button (Check Availability) */}
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-md w-full md:w-auto font-semibold hover:bg-blue-700 transition"
          onClick={onClick}
        >
          {submitType}
        </button>
      </div>
    </div>
  );
};
