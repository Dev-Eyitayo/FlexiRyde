import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPlus, FaMinus } from "react-icons/fa";
import heroBg from "../assets/heroBg.jpg";

const parks = ["Jibowu Terminal", "Berger Park", "Oshodi Park", "Ibadan Terminal", "Abuja Central Park"];

export default function BookHero() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const dateRef = useRef(null);
  const modalRef = useRef(null);

  // Close passenger modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowPassengerModal(false);
      }
    }

    if (showPassengerModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPassengerModal]);

  return (
    <div
      className="relative bg-cover bg-center h-[600px] flex items-center justify-center text-gray-700"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative text-center px-4 md:px-0 w-full">
        <h1 className="text-3xl text-white md:text-5xl font-bold">Book a comfortable ride at no cost...</h1>
        <div className="bg-gray-100 rounded-xl p-6 px-4 mt-6 shadow-lg w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-center">
            
            {/* Leaving From */}
            <div className="relative w-full">
              <div
                className="flex items-center border p-3 rounded-md w-full bg-gray-100 cursor-pointer"
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

              {/* Dropdown Suggestions */}
              <AnimatePresence>
                {showFromDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50"
                  >
                    {parks
                      .filter((park) => park.toLowerCase().includes(from.toLowerCase()))
                      .map((park, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
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
            <div className="relative w-full">
              <div
                className="flex items-center border p-3 rounded-md w-full bg-gray-100 cursor-pointer"
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

              {/* Dropdown Suggestions */}
              <AnimatePresence>
                {showToDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50"
                  >
                    {parks
                      .filter((park) => park.toLowerCase().includes(to.toLowerCase()))
                      .map((park, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
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
            <div className="flex items-center border p-3 rounded-md w-full bg-gray-100">
              <FaCalendarAlt className="text-gray-500 mr-3" />
              <input
                type="date"
                ref={dateRef}
                className="w-full bg-transparent focus:outline-none appearance-none"
                aria-label="Travel date"
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
                onFocus={() => dateRef.current?.showPicker()} // Auto open calendar
              />
            </div>

            {/* Passenger Selection */}
            <div className="relative w-full">
              <div
                className="flex items-center border p-3 rounded-md w-full bg-gray-100 cursor-pointer"
                onClick={() => setShowPassengerModal(true)}
              >
                <FaUser className="text-gray-500 mr-3" />
                <span>{passengers} Passenger{passengers > 1 ? "s" : ""}</span>
              </div>

              {/* Passenger Modal */}
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

            {/* Search Button */}
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md w-full md:w-auto font-semibold hover:bg-blue-700 transition">
              Check Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
