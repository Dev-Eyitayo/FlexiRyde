import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

export default function RouteVisualization({ route }) {
  const stops = route.intermediateStops
    ? [route.from, ...route.intermediateStops, route.to]
    : [route.from, route.to];

  return (
    <div className='bg-white px-4 py-4  rounded-2xl shadow-lg mb-6'>
      <h3 className='text-2xl font-bold text-gray-600 text-center mb-2'>
        Route Details
      </h3>

      <div className='flex items-center justify-center gap-8 min-h-[100px]'>
        {stops.map((stop, index) => (
          <div key={index} className='flex items-center gap-4 shrink-0'>
            <div
              className='flex flex-col items-center justify-center min-h-[80px] px-2'
              style={{ width: "max-content" }}
            >
              <FaMapMarkerAlt
                className={`text-2xl ${
                  index === 0
                    ? "text-green-500"
                    : index === stops.length - 1
                      ? "text-red-500"
                      : "text-blue-500"
                }`}
              />
              <span className='mt-1 text-sm font-medium text-gray-700 text-center'>
                {stop}
              </span>
            </div>
            {index < stops.length - 1 && (
              <FaArrowRight className='text-gray-400 text-xl' />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
