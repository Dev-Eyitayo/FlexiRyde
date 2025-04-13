import { useLocation } from "react-router-dom";

const Ticket = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <div className='text-center mt-10 mb-95'>No ticket data found.</div>;
  }

  const {
    payment_reference,
    ref_number,
    price,
    seat_count,
    seats,
    trip = {},
    user = {},
  } = booking;
  
  const {
    departure_datetime,
    route = {},
    bus = {},
  } = trip;
  
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
  

  // Build the route path
  const routePath = intermediate_stops.length
    ? [origin_park.name, ...intermediate_stops, destination_park.name]
    : [origin_park.name, destination_park.name];

  // Format datetime
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

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${ref_number}`;

  return (
    <div className='max-w-md mx-auto my-8 p-4' id='ticket-content'>
      <div className='border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg'>
        <div className='bg-blue-600 text-white p-4 text-center'>
          <h1 className='text-xl font-bold'>Travel Ticket Pass</h1>
          <p className='text-xs'>FlexiRyde Ticket</p>
        </div>

        <div className='p-4 bg-white'>
          <div className='flex justify-between mb-4'>
            <div>
              <p className='text-xs text-gray-500'>PASSENGER</p>
              <p className='font-bold'>{passengerName}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>TICKET NO</p>
              <p className='font-bold'>{ticketRef}</p>
            </div>
          </div>

          <div className='border-t-2 border-b-2 border-dashed border-gray-300 py-3 my-3'>
            <p className='text-xs text-gray-500 mb-1'>ROUTE</p>
            <p className='font-semibold text-gray-800'>
              {routePath.join(" → ")}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              {origin_city?.name} → {destination_city?.name}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <p className='text-xs text-gray-500'>DEPARTURE</p>
              <p className='font-bold'>{formattedDepartureTime}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>SEAT(S)</p>
              <p className='font-bold'>{totalSeats} seat(s)</p>
            </div>
          </div>

          <div className='flex justify-between items-center mb-4'>
            <div>
              <p className='text-xs text-gray-500'>BUS PlATE NUMBER</p>
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
              className='bg-blue-600 text-white px-4 py-2 rounded text-sm'
            >
              Print Ticket
            </button>
          </div>
        </div>

        <div className='bg-gray-100 p-2 text-center text-xs text-gray-600'>
          <p>Please arrive 30 minutes before departure</p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
