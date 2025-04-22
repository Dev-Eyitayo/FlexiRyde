import { useLocation } from "react-router-dom";
import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

const Ticket = () => {
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const booking =
    location.state?.booking ||
    JSON.parse(sessionStorage.getItem("recentBooking")) ||
    null;

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
    status, // Added status
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

  // Determine watermark text based on status
  const watermarkText =
    status === "cancelled"
      ? "CANCELLED"
      : status === "completed"
        ? "COMPLETED"
        : null;

  return (
    <div className='max-w-xl mx-auto my-8 p-6' id='ticket-content'>
      <div className='border-2 border-gray-800 rounded-lg overflow-hidden shadow-xl relative'>
        {/* Watermark */}
        {watermarkText && (
          <div
            className='absolute inset-0 flex items-center justify-center pointer-events-none'
            style={{
              transform: "rotate(-45deg)",
              opacity: 0.2, // Semi-transparent
              zIndex: 10,
              color: status === "cancelled" ? "red" : "gray", // Red for cancelled, gray for completed
              fontSize: "3rem", // Large text
              fontWeight: "bold",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {watermarkText}
          </div>
        )}

        <div className='bg-blue-600 text-white p-4 text-center'>
          <h1 className='text-2xl font-bold'>Travel Ticket Pass</h1>
          <p className='text-xs'>FlexiRyde Ticket</p>
        </div>

        <div className='p-5 bg-white relative'>
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
            <div
              className={`px-2 py-1 rounded text-sm ${
                status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : status === "completed"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-green-100 text-green-800"
              }`}
            >
              {status === "cancelled"
                ? "Cancelled"
                : status === "completed"
                  ? "Completed"
                  : "Paid"}
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
                          .watermark {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%) rotate(-45deg);
                            opacity: 0.2;
                            z-index: 10;
                            color: ${status === "cancelled" ? "red" : "gray"};
                            font-size: 3rem;
                            font-weight: bold;
                            text-transform: uppercase;
                            white-space: nowrap;
                          }
                        }
                      </style>
                    </head>
                    <body>${printContent}</body>
                  </html>
                `;
                window.print();
                document.body.innerHTML = originalContent;
                window.location.reload(); // Restore event listeners
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
