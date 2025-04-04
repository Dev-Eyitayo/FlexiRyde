import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChair, FaBus } from "react-icons/fa";

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

  const totalSeats = 16;
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
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Handle proceed button click
  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to proceed.", {
        duration: 1500,
      });
      return;
    }
    alert(`Proceeding to payment for seats: ${selectedSeats.join(", ")}`);
  };

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4 lg:px-8'>
      {/* Toast Notification */}
      <ToastContainer position='top-right' autoClose={3000} />

      {/* Header */}
      <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center'>
        Select Your Seats
      </h1>

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

      {/* Bus Layout */}
      <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mb-6'>
        <h3 className='text-lg font-semibold text-gray-700 mb-3'>
          Bus Seat Map
        </h3>

        {/* Bus Front */}
        <div className='flex justify-center mb-4'>
          <FaBus className='text-4xl text-gray-700' />
        </div>

        {/* Seat Grid */}
        <div className='grid grid-cols-4 gap-4'>
          <div className='col-span-4 grid grid-cols-4 gap-3'>
            {Array.from({ length: totalSeats }).map((_, index) => {
              const seatNumber = index + 1;
              const isTaken = seatNumber <= takenSeats;
              const isSelected = selectedSeats.includes(seatNumber);

              return (
                <div
                  key={seatNumber}
                  onClick={() => !isTaken && toggleSeatSelection(seatNumber)}
                  className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition
                    ${
                      isTaken
                        ? "text-red-500 cursor-not-allowed"
                        : isSelected
                          ? "text-yellow-500 bg-yellow-50"
                          : "text-green-500 hover:bg-green-50"
                    }`}
                >
                  <FaChair className='text-2xl' />
                  <span className='text-sm font-medium mt-1'>{seatNumber}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mb-6'>
        <h3 className='text-lg font-semibold text-gray-700 mb-3'>
          Payment Summary
        </h3>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Seats Selected:</span>
            <span className='font-medium'>
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Price per Seat:</span>
            <span className='font-medium'>₦{price.toLocaleString()}</span>
          </div>
          <div className='flex justify-between border-t pt-2'>
            <span className='text-gray-600 font-semibold'>Total Amount:</span>
            <span className='text-xl font-bold text-blue-600'>
              ₦{(price * selectedSeats.length).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Proceed to Payment */}
      <div className='w-full max-w-3xl'>
        <button
          onClick={handleProceed}
          className={`py-3 px-6 rounded-lg w-full text-lg font-semibold transition duration-300
            ${
              selectedSeats.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          disabled={selectedSeats.length === 0}
        >
          {selectedSeats.length > 0
            ? `Proceed with ${selectedSeats.length} Seats: ${selectedSeats.join(", ")}`
            : "Select Seats to Continue"}
        </button>
      </div>
    </div>
  );
}
