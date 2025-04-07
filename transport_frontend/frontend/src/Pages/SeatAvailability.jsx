// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import RouteVisualization from "../components/RouteVisualization";
// import { FaClock, FaExclamationTriangle } from "react-icons/fa";

// export default function SeatAvailability() {
//   const intermediateStops = []; // whatever makes sense
//   const [takenSeats, setTakenSeats] = useState([]);
//   const [availableSeats, setAvailableSeats] = useState([]);
//   const location = useLocation();
//   // const travelData = location.state?.searchInfo || {
//   //   from: "Lagos",
//   //   to: "Abuja",
//   //   date: "2025-04-10",
//   //   passengers: 1,
//   // };

//   // const {
//   //   from,
//   //   to,
//   //   date,
//   //   passengers: bookedSeats,
//   // } = travelData;
//   const trip = location.state?.trip; 


//   useEffect(() => {
//     const fetchSeatData = async () => {
//       if (!trip?.id) return;

//       try {
//         const response = await fetch(
//           `http://localhost:8000/api/trips/${trip.id}/seats/`, // Update base URL if needed
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         const data = await response.json();
//         setTakenSeats(data.taken_seat_ids || []);
//         setAvailableSeats(data.available_seats || []);
//         setCurrentSeats({
//           totalSeats: (data.taken_seat_ids?.length || 0) + (data.available_seats?.length || 0),
//           takenSeats: data.taken_seat_ids?.length || 0,
//         });
//       } catch (err) {
//         console.error("❌ Failed to fetch seat data:", err);
//         alert("❌ Failed to fetch seat data:", err);
//       }
//     };

//     fetchSeatData();
//   }, [trip]);

//   // const timeSlots = {
//   //   "08:00 AM": { totalSeats: 16, takenSeats: 16 },
//   //   "09:00 AM": { totalSeats: 16, takenSeats: 12 },
//   //   "10:00 AM": { totalSeats: 16, takenSeats: 8 },
//   //   "11:00 AM": { totalSeats: 16, takenSeats: 2 },
//   //   "12:00 PM": { totalSeats: 16, takenSeats: 0 },
//   // };



//   const [price, setPrice] = useState(0);
//   const defaultTime = "08:00 AM";
//   const [selectedTime, setSelectedTime] = useState(defaultTime);
//   const [currentSeats, setCurrentSeats] = useState(
//     timeSlots[defaultTime] || { totalSeats: 16, takenSeats: 0 }
//   );
  

//   useEffect(() => {
//     const basePrice = 1500;
//     const demandFactor = 1 + currentSeats.takenSeats / currentSeats.totalSeats;
//     setPrice(Math.round(basePrice * demandFactor));
//   }, [currentSeats]);

//   const handleProceed = () => {
//     const available = currentSeats.totalSeats - currentSeats.takenSeats;
//     if (available < bookedSeats) {
//       toast.error(
//         `Only ${available} seat(s) available at ${selectedTime}. Please choose another time.`,
//         {
//           position: "top-center",
//           autoClose: 5000,
//         }
//       );
//       return;
//     }
//     alert(
//       `Proceeding to payment for ${bookedSeats} seat(s) at ${selectedTime}`
//     );
//   };

//   setCurrentSeats({
//     totalSeats: taken + available,
//     takenSeats: taken,
//   });
  
//   const handleTimeChange = (e) => {
//     const newTime = e.target.value;
//     setSelectedTime(newTime);
//     setCurrentSeats(timeSlots[newTime] || { totalSeats: 16, takenSeats: 0 });
//   };

//   const isSeatAvailable =
//     currentSeats.totalSeats - currentSeats.takenSeats >= bookedSeats;

//   return (
//     <div className='min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 lg:px-8'>
//       <ToastContainer position='top-center' autoClose={5000} />
//       <div className='w-full max-w-6xl text-center mb-8'>
//         <h1 className='text-3xl font-bold text-gray-800 mb-2'>
//           Seat Availability
//         </h1>
//         <p className='text-gray-600'>
//           Check available seats and select your preferred departure time
//         </p>
//       </div>

      
//       <RouteVisualization
//         route={{ from, to, date, time: selectedTime, intermediateStops }}
//       />

//       <div className='bg-white rounded-lg shadow-md w-full max-w-4xl mb-8 p-6 border border-gray-100'>
//         <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
//           <FaClock className='mr-2 text-blue-500' />
//           Travel Details
//         </h2>

//         <div className='grid grid-cols-1 md:grid-cols-2 md:gap-18 gap-6'>
//           <div className='space-y-4'>
//             <div className='flex justify-between'>
//               <span className='text-gray-600'>From:</span>
//               <span className='font-medium'>{trip?.origin_park}</span>
//             </div>
//             <div className='flex justify-between'>
//               <span className='text-gray-600'>To:</span>
//               <span className='font-medium'>{trip?.destination_city}</span>
//             </div>
//             <div className='flex justify-between'>
//               <span className='text-gray-600'>Date:</span>
//               <span className='font-medium'>{trip?.travel_date}</span>
//             </div>
//           </div>

//           <div className='space-y-4'>
//             <div className='flex flex-col'>
//               <label htmlFor='time' className='text-gray-600 mb-1'>
//                 Departure Time:
//               </label>
//               <div className='relative'>
//                 <select
//                   id='time'
//                   value={selectedTime}
//                   onChange={handleTimeChange}
//                   className='appearance-none w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50'
//                 >
//                   {Object.keys(timeSlots).map((time) => (
//                     <option key={time} value={time}>
//                       {time} (
//                       {timeSlots[time].totalSeats - timeSlots[time].takenSeats}{" "}
//                       seats left)
//                     </option>
//                   ))}
//                 </select>

//                 <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500'>
//                   <svg
//                     className='w-5 h-5'
//                     fill='none'
//                     stroke='currentColor'
//                     viewBox='0 0 24 24'
//                   >
//                     <path
//                       strokeLinecap='round'
//                       strokeLinejoin='round'
//                       strokeWidth={2}
//                       d='M19 9l-7 7-7-7'
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <div className='flex justify-between'>
//               <span className='text-gray-600'>Seats to Book:</span>
//               <span className='font-medium'>{bookedSeats}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className='bg-white rounded-lg shadow-md w-full max-w-4xl mb-8 p-6 border border-gray-100'>
//         <h3 className='text-xl font-semibold text-gray-800 mb-4'>
//           Seat Availability
//         </h3>

//         <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
//           <div className='bg-gray-50 p-4 rounded-lg'>
//             <p className='text-gray-600'>Total Seats</p>
//             <p className='text-2xl font-bold text-gray-800'>
//               {currentSeats.totalSeats}
//             </p>
//           </div>
//           <div className='bg-green-50 p-4 rounded-lg'>
//             <p className='text-gray-600'>Available Seats</p>
//             <p className='text-2xl font-bold text-green-600'>
//               {currentSeats.totalSeats - currentSeats.takenSeats}
//             </p>
//           </div>
//           <div className='bg-red-50 p-4 rounded-lg'>
//             <p className='text-gray-600'>Booked Seats</p>
//             <p className='text-2xl font-bold text-red-600'>
//               {currentSeats.takenSeats}
//             </p>
//           </div>
//         </div>

//         {!isSeatAvailable && (
//           <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md'>
//             <div className='flex items-start'>
//               <FaExclamationTriangle className='text-yellow-500 mt-1 mr-2' />
//               <div>
//                 <p className='font-medium text-yellow-800'>
//                   Not Enough Seats
//                 </p>
//                 <p className='text-sm text-yellow-700'>
//                   Only {currentSeats.totalSeats - currentSeats.takenSeats}{" "}
//                   seat(s) available at {selectedTime}. Please select another
//                   time with sufficient seats.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className='bg-white rounded-lg shadow-md w-full max-w-4xl mb-8 p-6 border border-gray-100'>
//         <h3 className='text-xl font-semibold text-gray-800 mb-4'>
//           Payment Summary
//         </h3>

//         <div className='space-y-3'>
//           <div className='flex justify-between'>
//             <span className='text-gray-600'>Seats to Book:</span>
//             <span className='font-medium'>{bookedSeats}</span>
//           </div>
//           <div className='flex justify-between'>
//             <span className='text-gray-600'>Price per Seat:</span>
//             <span className='font-medium'>₦{price.toLocaleString()}</span>
//           </div>
//           <div className='border-t border-gray-200 pt-3'>
//             <div className='flex justify-between'>
//               <span className='text-gray-600 font-semibold'>
//                 Total Amount:
//               </span>
//               <span className='text-gray-800 text-lg font-bold'>
//                 ₦{(price * bookedSeats).toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className='w-full max-w-4xl'>
//         <button
//           onClick={handleProceed}
//           disabled={!isSeatAvailable}
//           className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-300 shadow-md
//             ${
//               isSeatAvailable
//                 ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 hover:shadow-lg"
//                 : "bg-gray-200 text-gray-500 cursor-not-allowed"
//             }`}
//         >
//           {isSeatAvailable
//             ? `Proceed to Book ${bookedSeats} Seat(s) at ${selectedTime}`
//             : "Select Another Time"}
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RouteVisualization from "../components/RouteVisualization";
import { FaClock, FaExclamationTriangle } from "react-icons/fa";
import authFetch from "../utils/authFetch"; 
import { useNavigate } from "react-router-dom"; 


export default function SeatAvailability() {
  const location = useLocation();
  const navigate = useNavigate();
  const trips = location.state?.trips || []; // ✅ clear and correct
  const travelData = location.state?.searchInfo || {};
  const { from, to, date, passengers: bookedSeats } = travelData;

  const [selectedTripId, setSelectedTripId] = useState(() => trips[0]?.id || "");
  const [trip, setTrip] = useState(() => trips[0] || null);
  const [takenSeats, setTakenSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [price, setPrice] = useState(0);
  const [currentSeats, setCurrentSeats] = useState({ totalSeats: 24, takenSeats: 0 });


  console.log(trips)  

  useEffect(() => {
    const selected = trips.find((t) => t.id === selectedTripId);
    setTrip(selected || null);
  }, [selectedTripId, trips]);

  useEffect(() => {
    const fetchSeatData = async () => {
      if (!selectedTripId) return;
  
      try {
        const response = await fetch(
          `http://localhost:8000/api/trips/${selectedTripId}/seats/`,
          // {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem("token")}`,
          //   },
          // }
        );
        const data = await response.json();
  
        const taken = data.taken_seat_ids?.length || 0;
        const available = data.available_seats?.length || 0;
        const total = taken + available;
  
        setTakenSeats(data.taken_seat_ids || []);
        setAvailableSeats(data.available_seats || []);
        setCurrentSeats({ totalSeats: total, takenSeats: taken });
  
        const currentTrip = trips.find((t) => t.id === selectedTripId);
        setTrip(currentTrip || null); // Make sure trip is synced too
  
        const basePrice = currentTrip?.seat_price || 1500;
        const demandFactor = 1 + taken / (total || 1);
        setPrice(Math.round(basePrice * demandFactor));
      } catch (err) {
        console.error("❌ Failed to fetch seat data:", err);
        alert("❌ Failed to fetch seat data");
      }
    };
  
    fetchSeatData();
  }, [selectedTripId, trips]); // <- trigger on ID or trip list change
  
  const isSeatAvailable = currentSeats.totalSeats - currentSeats.takenSeats >= bookedSeats;

  const handleProceed = async () => {
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");

    if (!token) {
      toast.warning("🔐 Please log in to proceed with booking.", {
        position: "top-center",
        autoClose: 4000,
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1500);
      return;
    }

    const available = currentSeats.totalSeats - currentSeats.takenSeats;
    if (available < bookedSeats) {
      toast.error(
        `Only ${available} seat(s) available. Please choose fewer seats.`,
        { position: "top-center", autoClose: 5000 }
      );
      return;
    }

    try {
      const response = await authFetch("/bookings/", {
        method: "POST",
        body: JSON.stringify({
          trip: selectedTripId,
          price: price * bookedSeats,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("🎉 Booking successful!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Redirect or show booking details
        setTimeout(() => {
          navigate("/booking-success", { state: { booking: data } });
        }, 2000);
      } else {
        toast.error(`Booking failed: ${data?.message || "Please try again."}`);
      }
    } catch (err) {
      console.error("❌ Booking error:", err);
      toast.error("Something went wrong while booking.");
    }
  };
  

  function formatTime(timeStr) {
    if (!timeStr) return "—";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${suffix}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 lg:px-8">
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Seat Availability
        </h1>
        <p className="text-gray-600">
          Select departure time to view seat availability
        </p>
      </div>

      <RouteVisualization
        route={{
          from,
          to,
          date,
          time: trip?.departure_time || "—",
          intermediateStops: [],
        }}
      />

      {/* Time selection */}
      <div className="w-full max-w-4xl mb-6">
        <label htmlFor="time" className="block text-lg text-gray-700 mb-1">
          Select Departure Time:
        </label>
        <select
          id="time"
          value={selectedTripId}
          onChange={(e) => setSelectedTripId(Number(e.target.value))}
          className="..."
        >
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {formatTime(t.departure_time)} - ₦{t.seat_price.toLocaleString()}
            </option>
          ))}
        </select>

      </div>

      {/* Travel Summary */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mb-8 p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaClock className="mr-2 text-blue-500" />
          Travel Details
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">From:</span>
            <span className="font-medium">{from}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{to}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Departure:</span>
            <span className="font-medium">{trip?.departure_time}</span>
          </div>
        </div>
      </div>

      {/* Seat Breakdown */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mb-8 p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Seat Availability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Total Seats</p>
            <p className="text-2xl font-bold text-gray-800">
              {currentSeats.totalSeats}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600">Available Seats</p>
            <p className="text-2xl font-bold text-green-600">
              {currentSeats.totalSeats - currentSeats.takenSeats}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-gray-600">Booked Seats</p>
            <p className="text-2xl font-bold text-red-600">
              {currentSeats.takenSeats}
            </p>
          </div>
        </div>

        {!isSeatAvailable && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2" />
              <div>
                <p className="font-medium text-yellow-800">
                  Not Enough Seats
                </p>
                <p className="text-sm text-yellow-700">
                  Only {currentSeats.totalSeats - currentSeats.takenSeats} seat(s)
                  available. Please reduce number of passengers.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mb-8 p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Payment Summary
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Seats to Book:</span>
            <span className="font-medium">{bookedSeats}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price per Seat:</span>
            <span className="font-medium">₦{price.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-600 font-semibold">Total Amount:</span>
              <span className="text-gray-800 text-lg font-bold">
                ₦{(price * bookedSeats).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <button
          onClick={handleProceed}
          disabled={!isSeatAvailable}
          className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-300 shadow-md
            ${
              isSeatAvailable
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 hover:shadow-lg"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
        >
          {isSeatAvailable
            ? `Proceed to Book ${bookedSeats} Seat(s)`
            : "Not Enough Seats"}
        </button>
      </div>
    </div>
  );
}
