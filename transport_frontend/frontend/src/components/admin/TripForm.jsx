// src/components/admin/TripForm.jsx
import { useEffect, useState } from "react";
import authFetch from "../../utils/authFetch";  // Use authFetch

export default function TripForm({ parkId, trip, onClear }) {
  const [formData, setFormData] = useState({
    route_id: "",
    bus_id: "",
    travel_date: "",
    departure_time: "",
    seat_price: "",
  });
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [routesRes, busesRes] = await Promise.all([
          authFetch(`/api/routes/?origin_park=${parkId}`),
          authFetch(`/api/buses/?park=${parkId}`),
        ]);
        if (!routesRes.ok || !busesRes.ok) throw new Error("Failed to fetch options");
        setRoutes(await routesRes.json());
        setBuses(await busesRes.json());
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    if (parkId) {
      fetchOptions();
    }
    if (trip) {
      setFormData({
        route_id: trip.route_id,
        bus_id: trip.bus_id,
        travel_date: trip.travel_date,
        departure_time: trip.departure_time || "",
        seat_price: trip.seat_price || "",
      });
    }
  }, [parkId, trip]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = trip ? "PUT" : "POST";
    const url = trip ? `/api/trips/${trip.id}/` : "/api/trips/";
    try {
      const res = await authFetch(url, {
        method,
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert(trip ? "Trip updated!" : "Trip created!");
        setFormData({ route_id: "", bus_id: "", travel_date: "", departure_time: "", seat_price: "" });
        onClear();
      } else {
        const errorData = await res.json();
        alert("Error: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error submitting trip:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">{trip ? "Edit Trip" : "Create Trip"}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Route</label>
          <select
            value={formData.route_id}
            onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
            className="mt-1 block w-full border rounded-md p-2"
            required
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.origin_park.name} → {route.destination_park.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Bus</label>
          <select
            value={formData.bus_id}
            onChange={(e) => setFormData({ ...formData, bus_id: e.target.value })}
            className="mt-1 block w-full border rounded-md p-2"
            required
          >
            <option value="">Select Bus</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.number_plate} ({bus.total_seats} seats)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Travel Date</label>
          <input
            type="date"
            value={formData.travel_date}
            onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
            className="mt-1 block w-full border rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Departure Time</label>
          <input
            type="time"
            value={formData.departure_time}
            onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Seat Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.seat_price}
            onChange={(e) => setFormData({ ...formData, seat_price: e.target.value })}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          {trip ? "Update Trip" : "Create Trip"}
        </button>
        {trip && (
          <button
            type="button"
            onClick={onClear}
            className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}