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
    status,
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

  const handlePrint = () => {
    // Create a print-specific stylesheet
    const printStyle = document.createElement("style");
    printStyle.innerHTML = `
      @media print {
        body * {
          visibility: hidden; /* Hide everything by default */
        }
        #ticket-content, #ticket-content * {
          visibility: visible; /* Show only ticket content */
        }
        #ticket-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          margin: 0;
          padding: 0;
        }
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
        /* Center QR code in print */
        .qr-code-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .qr-code-container img {
          margin-left: auto;
          margin-right: auto;
          display: block;
        }
        /* Ensure no headers, footers, or other UI elements are printed */
        header, footer, nav, aside, .navbar, .sidebar, .modal, .toast, [class*="header"], [class*="footer"] {
          display: none !important;
        }
        @page {
          size: auto;
          margin: 1cm;
        }
      }
    `;
    document.head.appendChild(printStyle);

    // Trigger print
    window.print();

    // Clean up the stylesheet after printing
    setTimeout(() => {
      document.head.removeChild(printStyle);
    }, 1000); // Delay to ensure print dialog has appeared
  };

  // Determine watermark text based on status
  const watermarkText =
    status === "cancelled"
      ? "CANCELLED"
      : status === "completed"
        ? "COMPLETED"
        : null;

  return (
    <div className='max-w-xl mx-auto my-8 p-4' id='ticket-content'>
      <div className='border-2 border-gray-800 rounded-lg overflow-hidden shadow-xl relative'>
        {/* Watermark */}
        {watermarkText && (
          <div
            className='absolute inset-0 flex items-center justify-center pointer-events-none watermark'
            style={{
              transform: "rotate(-45deg)",
              opacity: 0.2,
              zIndex: 10,
              color: status === "cancelled" ? "red" : "gray",
              fontSize: "4.2rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {watermarkText}
          </div>
        )}

        <div className='bg-blue-600 text-white p-4 text-center'>
          <h1 className='text-xl md:text-2xl font-bold'>Travel Ticket Pass</h1>
          <p className='text-xs'>FlexiRyde Ticket</p>
        </div>

        <div className='p-5 bg-white relative'>
          <div className='flex justify-between items-start mb-5'>
            <div>
              <p className='text-xs text-gray-500 mb-1'>PASSENGER</p>
              <p className='text-sm md:text-base font-bold'>{passengerName}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>TICKET NO</p>
              <div className='flex items-center space-x-2'>
                <p className='text-sm md:text-base font-bold break-all'>
                  {ticketRef}
                </p>
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
            <p className='font-semibold text-gray-800 text-sm md:text-base'>
              {routePath.join(" → ")}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              {origin_city?.name} → {destination_city?.name}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-5'>
            <div>
              <p className='text-xs text-gray-500 mb-1'>DEPARTURE</p>
              <p className='text-sm md:text-base font-bold'>
                {formattedDepartureTime}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>SEAT(S)</p>
              <p className='text-sm md:text-base font-bold'>
                {totalSeats} seat{totalSeats > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className='flex justify-between items-center mb-6'>
            <div>
              <p className='text-xs text-gray-500 mb-1'>BUS PLATE NUMBER</p>
              <p className='text-sm md:text-base font-bold'>{busCompany}</p>
            </div>
            <div
              className={`px-2 py-1 rounded text-sm ${
                status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : status === "completed"
                    ? "bg-gray-100 text-gray-800"
                    : status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
              }`}
            >
              {status === "cancelled"
                ? "Cancelled"
                : status === "completed"
                  ? "Completed"
                  : status === "pending"
                    ? "Pending"
                    : "Paid"}
            </div>
          </div>

          {/* QR Code */}
          <div className='qr-code-container flex flex-col items-center justify-center mt-6'>
            <img
              src={qrCodeUrl}
              alt='QR Code'
              className='w-24 h-24 mx-auto mb-2'
            />
            <p className='text-xs text-gray-500 mb-3'>SCAN TO VERIFY</p>
            <button
              onClick={handlePrint}
              className='bg-blue-600 text-white px-5 py-2 rounded text-xs md:text-sm hover:bg-blue-700 transition'
            >
              Print Ticket
            </button>
          </div>
        </div>

        <div className='bg-gray-100 p-3 text-center text-xs md:text-sm text-gray-600'>
          <p>Please arrive 30 minutes before departure</p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
