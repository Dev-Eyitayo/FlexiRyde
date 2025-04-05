import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

export default function RouteVisualization({ route }) {
  const stops = route.intermediateStops
    ? [route.from, ...route.intermediateStops, route.to]
    : [route.from, route.to];

  return (
    <div className='bg-white px-4 py-4 rounded-2xl shadow-lg mb-6'>
      <h3 className='text-xl font-bold text-gray-600 text-center mb-2'>
        Route Details
      </h3>

      <div className='flex items-center justify-center min-h-[100px] overflow-x-auto'>
        <div className='flex items-center gap-2 sm:gap-4 px-2'>
          {stops.map((stop, index) => (
            <div key={index} className='flex items-center shrink-0'>
              <div className='flex flex-col items-center justify-center min-h-[60px] px-1 sm:px-2'>
                <FaMapMarkerAlt
                  className={`text-xl sm:text-2xl ${
                    index === 0
                      ? "text-green-500"
                      : index === stops.length - 1
                        ? "text-red-500"
                        : "text-blue-500"
                  }`}
                />
                <span className='mt-1 text-xs sm:text-sm font-medium text-gray-700 text-center'>
                  {stop}
                </span>
              </div>
              {index < stops.length - 1 && (
                <FaArrowRight className='text-gray-400 text-lg sm:text-xl mx-1 sm:mx-2' />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
