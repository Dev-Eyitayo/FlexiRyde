import { FaCalendarAlt, FaClock, FaUser } from "react-icons/fa";

export default function TripCard({
  trip,
  canCancel,
  onCancelClick,
  onViewTicket,
}) {
  let badgeClasses = "px-3 py-1 text-xs rounded-full font-semibold ";
  if (trip.status === "confirmed") {
    badgeClasses += "bg-blue-100 text-blue-800";
  } else if (trip.status === "completed") {
    badgeClasses += "bg-green-100 text-green-800";
  } else {
    badgeClasses += "bg-red-100 text-red-800";
  }

  return (
    <div
      key={trip.id}
      className='relative bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-6'
    >
      {/* Status Badge */}
      <span className={`absolute top-3 text-sm right-3 ${badgeClasses}`}>
        {trip.status}
      </span>

      {/* Route + Reference */}
      <div className='sm:flex sm:justify-between sm:items-start'>
        <div className='mb-4 md:mt-0 mt-4 sm:mb-0'>
          <h2 className='md:text-lg sm:mt-3 text-base font-bold text-gray-800 mb-1'>
            {trip.from} <span className='mx-2 text-gray-400'>→</span> {trip.to}
          </h2>
          <p className='text-xs text-gray-500'>
            Ref:{" "}
            {trip.status === "pending" ? (
              <span className='font-mono'>
                Please Re-book and make payment to get a ref number
              </span>
            ) : (
              <span className='font-mono'>{trip.bookingRef}</span>
            )}
          </p>
        </div>
      </div>

      {/* Trip Details */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-5'>
        <div className='flex items-center text-gray-700 text-sm'>
          <FaCalendarAlt className='mr-2 text-blue-500' />
          {trip.date}
        </div>
        <div className='flex items-center text-gray-700 text-sm'>
          <FaClock className='mr-2 text-blue-500' />
          {trip.time}
        </div>
        <div className='flex items-center text-gray-700 text-sm'>
          <FaUser className='mr-2 text-blue-500' />
          {trip.seats} seat{trip.seats > 1 ? "s" : ""}
        </div>
      </div>

      {/* Price + Actions */}
      <div className='flex justify-between items-center mt-6'>
        <span className='text-xl font-bold text-gray-800'>{trip.price}</span>

        <div className='flex flex-row'>
          {trip.status === "confirmed" && canCancel(trip) && (
            <button
              onClick={() => onCancelClick(trip)}
              className='px-4 py-2 rounded-md text-sm font-medium border bg-red-500 text-white hover:bg-red-600 transition-colors focus:outline-none'
            >
              Cancel
            </button>
          )}

          {["confirmed", "completed", "cancelled"].includes(trip.status) && (
            <button
              onClick={() => onViewTicket(trip.originalBooking)}
              className='ml-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition'
            >
              View Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
