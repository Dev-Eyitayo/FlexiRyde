import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

export default function RouteVisualization({ route }) {
  // Default to direct route if no intermediate stops
  const stops = route.intermediateStops
    ? [route.from, ...route.intermediateStops, route.to]
    : [route.from, route.to];

  return (
    <div className='bg-white p-4 rounded-lg shadow-md mb-4'>
      <h3 className='text-lg font-semibold text-gray-700 mb-3'>
        Route Details
      </h3>
      <div className='flex items-center flex-wrap gap-2'>
        {stops.map((stop, index) => (
          <div key={index} className='flex items-center'>
            <div className='flex flex-col items-center'>
              <FaMapMarkerAlt
                className={`text-xl ${
                  index === 0
                    ? "text-green-500"
                    : index === stops.length - 1
                      ? "text-red-500"
                      : "text-blue-500"
                }`}
              />
              <span className='text-sm font-medium mt-1'>{stop}</span>
            </div>
            {index < stops.length - 1 && (
              <FaArrowRight className='mx-2 text-gray-400' />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
