import { useState, useEffect } from "react";
import authFetch from "../../utils/authFetch";
import { showToast } from "../../utils/toastUtils";
import {dismissToast} from "../../utils/toastUtils";
import { toast } from "react-toastify";

export default function TripList({ parkId, onEdit, refreshTrigger }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const res = await authFetch(`/parks/${parkId}/trips/`);
      if (!res.ok) throw new Error("Failed to fetch trips");
      const data = await res.json();
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
      showToast("error", "Failed to load trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [parkId, refreshTrigger]); // Refetch when refreshTrigger changes

  if (loading) {
    return <div className="text-gray-500">Loading trips...</div>;
  }

  if (trips.length === 0) {
    return <div>No trips scheduled yet.</div>;
  }

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Scheduled Trips</h2>
      <div className="space-y-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {trip.route.origin_park.name} to {trip.route.destination_park.name}
              </p>
              <p className="text-sm text-gray-600">
                Bus: {trip.bus.number_plate} | Departure: {trip.travel_date} {trip.departure_time} | Price: ₦{trip.seat_price}
              </p>
            </div>
            <button
              onClick={() => onEdit(trip)}
              className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}