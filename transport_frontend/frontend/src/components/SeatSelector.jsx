// components/SeatSelector.jsx

import { useState, useEffect } from "react";
import { FaChair } from "react-icons/fa";
import PropTypes from "prop-types";

export default function SeatSelector({
  totalSeats,
  maxSelectable,
  bookedSeats,
  onSeatsSelected,
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Reset selected seats when bookedSeats or maxSelectable changes
  useEffect(() => {
    setSelectedSeats([]);
  }, [bookedSeats, maxSelectable]);

  const handleSelect = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return; // Prevent selecting booked seats

    if (selectedSeats.includes(seatNumber)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else if (selectedSeats.length < maxSelectable) {
      // Select seat
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Notify parent of selected seats
  useEffect(() => {
    onSeatsSelected(selectedSeats);
  }, [selectedSeats, onSeatsSelected]);

  // Generate seat grid (1-based indexing)
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className='grid grid-cols-4 gap-4 max-w-md mx-auto'>
      {seats.map((seatNumber) => (
        <button
          key={seatNumber}
          onClick={() => handleSelect(seatNumber)}
          disabled={bookedSeats.includes(seatNumber)}
          className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg border font-semibold transition-all duration-200
            ${
              bookedSeats.includes(seatNumber)
                ? "bg-red-200 text-red-800 cursor-not-allowed"
                : selectedSeats.includes(seatNumber)
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-blue-100"
            }`}
        >
          <FaChair className='mb-1 text-lg' />
          {seatNumber}
        </button>
      ))}
    </div>
  );
}

SeatSelector.propTypes = {
  totalSeats: PropTypes.number.isRequired,
  maxSelectable: PropTypes.number.isRequired,
  bookedSeats: PropTypes.arrayOf(PropTypes.number).isRequired,
  onSeatsSelected: PropTypes.func.isRequired,
};
