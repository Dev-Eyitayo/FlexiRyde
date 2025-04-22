// import { useLocation } from "react-router-dom";
// import { useState } from "react";
// import { FiCopy, FiCheck } from "react-icons/fi"; // Icon imports

// const Ticket = () => {
//   const location = useLocation();
//   const [copied, setCopied] = useState(false);
//   const booking =
//     location.state?.booking ||
//     JSON.parse(sessionStorage.getItem("recentBooking")) ||
//     null;

//   if (!booking) {
//     return <div className='text-center mt-10 mb-95'>No ticket data found.</div>;
//   }

//   const {
//     payment_reference,
//     ref_number,
//     seat_count,
//     seats,
//     trip = {},
//     user = {},
//   } = booking;

//   const { departure_datetime, route = {}, bus = {} } = trip;

//   const {
//     origin_park = {},
//     destination_park = {},
//     origin_city = {},
//     destination_city = {},
//     intermediate_stops = [],
//   } = route;

//   const passengerName = `${user?.first_name || ""} ${user?.last_name || ""}`;
//   const ticketRef = ref_number || payment_reference || "—";
//   const totalSeats = seats ?? seat_count ?? "—";
//   const busCompany = bus.name || bus.number_plate || "—";

//   const routePath = intermediate_stops.length
//     ? [origin_park.name, ...intermediate_stops, destination_park.name]
//     : [origin_park.name, destination_park.name];

//   const departureDateObj = new Date(departure_datetime);
//   const formattedDepartureTime = departureDateObj.toLocaleString("en-NG", {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });

//   const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${ticketRef}`;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(ticketRef).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   return (
//     <div className='max-w-xl mx-auto my-8 p-6' id='ticket-content'>
//       <div className='border-2 border-gray-800 rounded-lg overflow-hidden shadow-xl'>
//         <div className='bg-blue-600 text-white p-4 text-center'>
//           <h1 className='text-2xl font-bold'>Travel Ticket Pass</h1>
//           <p className='text-xs'>FlexiRyde Ticket</p>
//         </div>

//         <div className='p-5 bg-white'>
//           <div className='flex justify-between items-start mb-5'>
//             <div>
//               <p className='text-xs text-gray-500 mb-1'>PASSENGER</p>
//               <p className='font-bold text-base'>{passengerName}</p>
//             </div>
//             <div>
//               <p className='text-xs text-gray-500 mb-1'>TICKET NO</p>
//               <div className='flex items-center space-x-2'>
//                 <p className='font-bold text-base break-all'>{ticketRef}</p>
//                 <button
//                   onClick={handleCopy}
//                   className='text-blue-600 hover:text-blue-800 focus:outline-none'
//                   title='Copy Reference'
//                 >
//                   {copied ? (
//                     <FiCheck className='w-5 h-5' />
//                   ) : (
//                     <FiCopy className='w-5 h-5' />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className='border-t-2 border-b-2 border-dashed border-gray-300 py-3 my-4'>
//             <p className='text-xs text-gray-500 mb-1'>ROUTE</p>
//             <p className='font-semibold text-gray-800 text-base'>
//               {routePath.join(" → ")}
//             </p>
//             <p className='text-xs text-gray-500 mt-1'>
//               {origin_city?.name} → {destination_city?.name}
//             </p>
//           </div>

//           <div className='grid grid-cols-2 gap-4 mb-5'>
//             <div>
//               <p className='text-xs text-gray-500 mb-1'>DEPARTURE</p>
//               <p className='font-bold'>{formattedDepartureTime}</p>
//             </div>
//             <div>
//               <p className='text-xs text-gray-500 mb-1'>SEAT(S)</p>
//               <p className='font-bold'>
//                 {totalSeats} seat{totalSeats > 1 ? "s" : ""}
//               </p>
//             </div>
//           </div>

//           <div className='flex justify-between items-center mb-6'>
//             <div>
//               <p className='text-xs text-gray-500 mb-1'>BUS PLATE NUMBER</p>
//               <p className='font-bold'>{busCompany}</p>
//             </div>
//             <div className='px-2 py-1 rounded bg-green-100 text-green-800 text-sm'>
//               Paid
//             </div>
//           </div>

//           {/* QR Code */}
//           <div className='text-center mt-6'>
//             <img
//               src={qrCodeUrl}
//               alt='QR Code'
//               className='w-24 h-24 mx-auto mb-2'
//             />
//             <p className='text-xs text-gray-500 mb-3'>SCAN TO VERIFY</p>
//             <button
//               onClick={() => {
//                 const originalContent = document.body.innerHTML;
//                 const printContent =
//                   document.getElementById("ticket-content").outerHTML;
//                 document.body.innerHTML = `
//                   <!DOCTYPE html>
//                   <html>
//                     <head>
//                       <style>
//                         @media print {
//                           @page { size: auto; margin: 0mm; }
//                           body { margin: 1.6cm; }
//                         }
//                       </style>
//                     </head>
//                     <body>${printContent}</body>
//                   </html>
//                 `;
//                 window.print();
//                 document.body.innerHTML = originalContent;
//               }}
//               className='bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700 transition'
//             >
//               Print Ticket
//             </button>
//           </div>
//         </div>

//         <div className='bg-gray-100 p-3 text-center text-xs text-gray-600'>
//           <p>Please arrive 30 minutes before departure</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Ticket;

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCopy, FiCheck } from "react-icons/fi";
import authFetch from "../utils/authFetch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [booking, setBooking] = useState(
    location.state?.booking ||
      JSON.parse(sessionStorage.getItem("recentBooking")) ||
      null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      const params = new URLSearchParams(location.search);
      const bookingId = params.get("booking_id");

      if (!booking && bookingId) {
        setLoading(true);
        try {
          const token =
            localStorage.getItem("access") || sessionStorage.getItem("access");
          if (!token) {
            toast.warning("Please log in to view your ticket.", {
              position: "top-right",
              autoClose: 3000,
            });
            setTimeout(() => navigate("/auth"), 1500);
            return;
          }

          const response = await authFetch(`/api/bookings/${bookingId}/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch booking details");
          }

          const data = await response.json();
          setBooking(data);
          sessionStorage.setItem("recentBooking", JSON.stringify(data));
        } catch (err) {
          toast.error(`Error: ${err.message || "Failed to load ticket."}`, {
            position: "top-right",
            autoClose: 3000,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBooking();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className='text-center mt-10 mb-95'>Loading ticket details...</div>
    );
  }

  if (!booking) {
    return <div className='text-center mt-10 mb-95'>No ticket data found.</div>;
  }

  const {
    payment_reference,
    ref_number,
    seat_count,
    seats,
    trip = {},
    user = {},
  } = booking;

  const { departure_datetime, route = {}, bus = {} } = trip;

  const {
    origin_park = {},
    destination_park = {},
    origin_city = {},
    destination_city = {},
    intermediate_stops = [],
  } = route;

  const passengerName = `${user?.first_name || ""} ${user?.last_name || ""}`;
  const ticketRef = ref_number || payment_reference || "—";
  const totalSeats = seats ?? seat_count ?? "—";
  const busCompany = bus.name || bus.number_plate || "—";

  const routePath = intermediate_stops.length
    ? [origin_park.name, ...intermediate_stops, destination_park.name]
    : [origin_park.name, destination_park.name];

  const departureDateObj = new Date(departure_datetime);
  const formattedDepartureTime = departureDateObj.toLocaleString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${ticketRef}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketRef).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className='max-w-xl mx-auto my-8 p-6' id='ticket-content'>
      <ToastContainer position='top-center' autoClose={5000} />
      <div className='border-2 border-gray-800 rounded-lg overflow-hidden shadow-xl'>
        <div className='bg-blue-600 text-white p-4 text-center'>
          <h1 className='text-2xl font-bold'>Travel Ticket Pass</h1>
          <p className='text-xs'>FlexiRyde Ticket</p>
        </div>

        <div className='p-5 bg-white'>
          <div className='flex justify-between items-start mb-5'>
            <div>
              <p className='text-xs text-gray-500 mb-1'>PASSENGER</p>
              <p className='font-bold text-base'>{passengerName}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>TICKET NO</p>
              <div className='flex items-center space-x-2'>
                <p className='font-bold text-base break-all'>{ticketRef}</p>
                <button
                  onClick={handleCopy}
                  className='text-blue-600 hover:text-blue-800 focus:outline-none'
                  title='Copy Reference'
                >
                  {copied ? (
                    <FiCheck className='w-5 h-5' />
                  ) : (
                    <FiCopy className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className='border-t-2 border-b-2 border-dashed border-gray-300 py-3 my-4'>
            <p className='text-xs text-gray-500 mb-1'>ROUTE</p>
            <p className='font-semibold text-gray-800 text-base'>
              {routePath.join(" → ")}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              {origin_city?.name} → {destination_city?.name}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-5'>
            <div>
              <p className='text-xs text-gray-500 mb-1'>DEPARTURE</p>
              <p className='font-bold'>{formattedDepartureTime}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>SEAT(S)</p>
              <p className='font-bold'>
                {totalSeats} seat{totalSeats > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className='flex justify-between items-center mb-6'>
            <div>
              <p className='text-xs text-gray-500 mb-1'>BUS PLATE NUMBER</p>
              <p className='font-bold'>{busCompany}</p>
            </div>
            <div className='px-2 py-1 rounded bg-green-100 text-green-800 text-sm'>
              Paid
            </div>
          </div>

          {/* QR Code */}
          <div className='text-center mt-6'>
            <img
              src={qrCodeUrl}
              alt='QR Code'
              className='w-24 h-24 mx-auto mb-2'
            />
            <p className='text-xs text-gray-500 mb-3'>SCAN TO VERIFY</p>
            <button
              onClick={() => {
                const originalContent = document.body.innerHTML;
                const printContent =
                  document.getElementById("ticket-content").outerHTML;
                document.body.innerHTML = `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        @media print {
                          @page { size: auto; margin: 0mm; }
                          body { margin: 1.6cm; }
                        }
                      </style>
                    </head>
                    <body>${printContent}</body>
                  </html>
                `;
                window.print();
                document.body.innerHTML = originalContent;
              }}
              className='bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700 transition'
            >
              Print Ticket
            </button>
          </div>
        </div>

        <div className='bg-gray-100 p-3 text-center text-xs text-gray-600'>
          <p>Please arrive 30 minutes before departure</p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
