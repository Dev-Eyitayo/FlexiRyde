import { useState } from "react";
import { FaChair } from "react-icons/fa";

export default function SeatSelector({ totalSeats = 24, maxSelectable = 1 }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSelect = (seatNumber) => {
    const alreadySelected = selectedSeats.includes(seatNumber);
    if (alreadySelected) {
      setSelectedSeats((prev) =>
        prev.filter((num) => num !== seatNumber)
      );
    } else {
      if (selectedSeats.length < maxSelectable) {
        setSelectedSeats((prev) => [...prev, seatNumber]);
      }
    }
  };

  return (
    <div className='grid grid-cols-4 gap-4 max-w-md mx-auto'>
      {[...Array(totalSeats)].map((_, index) => {
        const seatNum = index + 1;
        const isSelected = selectedSeats.includes(seatNum);

        return (
          <button
            key={seatNum}
            onClick={() => handleSelect(seatNum)}
            className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg border font-semibold transition-all duration-200
              ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-blue-100"
              }
            `}
          >
            <FaChair className='mb-1 text-lg' />
            {seatNum}
          </button>
        );
      })}
    </div>
  );
}
