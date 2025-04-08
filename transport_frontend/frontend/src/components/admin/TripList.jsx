import { useEffect, useState } from "react";
import authFetch from "../../utils/authFetch";

export default function TripList({ parkId, onEdit }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await authFetch(`/api/trips/?origin_park=${parkId}`);
        const data = await res.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [parkId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Scheduled Trips</h2>
      {trips.length === 0 ? (
        <p>No trips scheduled yet.</p>
      ) : (
        <ul className="space-y-2">
          {trips.map((trip) => (
            <li key={trip.id} className="border-b py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {trip.route.origin_park.name} → {trip.route.destination_park.name}
                </p>
                <p className="text-sm text-gray-600">
                  {trip.travel_date} at {trip.departure_time}
                </p>
              </div>
              <button
                onClick={() => onEdit(trip)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}