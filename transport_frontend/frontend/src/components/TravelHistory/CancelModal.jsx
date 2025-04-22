export default function CancelModal({ show, trip, onClose, onConfirm }) {
  if (!show || !trip) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-lg bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white mx-4 p-6 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 scale-100'>
        <h2 className='text-2xl font-bold text-red-600 mb-3'>Cancel Trip</h2>
        <p className='text-sm text-gray-600 mb-5'>
          Are you sure you want to cancel your trip from{" "}
          <strong>{trip.from}</strong> to <strong>{trip.to}</strong>?
        </p>
        <div className='flex justify-end space-x-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors focus:outline-none'
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none'
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
