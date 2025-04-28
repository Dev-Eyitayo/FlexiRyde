export default function FilterButtons({ filter, setFilter }) {
  const filters = ["all", "confirmed", "completed", "cancelled"];
  return (
    <div className='flex flex-wrap gap-3 mb-8'>
      {filters.map((type) => (
        <button
          key={type}
          onClick={() => setFilter(type)}
          className={`px-3 py-1 rounded-full text-sm font-medium shadow 
            transition-transform transform hover:scale-105 focus:outline-none
            ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }
          `}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
}
