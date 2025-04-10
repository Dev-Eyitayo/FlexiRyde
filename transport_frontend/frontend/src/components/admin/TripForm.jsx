import { useState, useEffect } from "react";
import authFetch from "../../utils/authFetch";
import { showToast } from "../../utils/toastUtils";
import {dismissToast} from "../../utils/toastUtils";
// import toast from "react-hot-toast";
import { toast } from "react-toastify";

export default function TripForm({ parkId, trip, onClear, onTripSaved }) {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    route_id: "",
    bus_id: "",
    departure_time: "",
    seat_price: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoutesAndBuses = async () => {
      try {
        const routesRes = await authFetch(`/parks/${parkId}/routes/`);
        if (!routesRes.ok) throw new Error("Failed to fetch routes");
        const routesData = await routesRes.json();
        setRoutes(routesData);
  
        const busesRes = await authFetch(`/parks/${parkId}/buses`);
        if (!busesRes.ok) throw new Error("Failed to fetch buses");
        const busesData = await busesRes.json();
        setBuses(busesData);
      } catch (error) {
        console.error("Error fetching routes and buses:", error);
        showToast("error", "Failed to load routes and buses.");
      }
    };
  
    const populateTripData = async () => {
      if (trip) {
        try {
          // Fetch the full trip details to get bus_id
          const tripRes = await authFetch(`/trips/${trip.id}/`);
          if (!tripRes.ok) throw new Error("Failed to fetch trip details");
          const tripData = await tripRes.json();
  
          // Combine travel_date and departure_time into datetime-local format
          const departureDateTime = new Date(`${trip.travel_date} ${trip.departure_time}`);
          const formattedDateTime = departureDateTime.toISOString().slice(0, 16);
  
          setFormData({
            route_id: tripData.route.id, // Full trip data has the route ID
            bus_id: tripData.bus.id,     // Full trip data has the bus ID
            departure_time: formattedDateTime,
            seat_price: trip.seat_price,
          });
        } catch (error) {
          console.error("Error fetching trip details:", error);
          showToast("error", "Failed to load trip details.");
        }
      }
    };
  
    fetchRoutesAndBuses();
    populateTripData();
  }, [parkId, trip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = showToast("loading", "Processing trip...");
  
    try {
      const url = trip ? `/trips/${trip.id}/` : `/parks/${parkId}/trips/create/`;
      const method = trip ? "PATCH" : "POST";
  
      const res = await authFetch(url, {
        method,
        body: JSON.stringify({
          route_id: formData.route_id,
          bus_id: formData.bus_id,
          departure_datetime: formData.departure_time,
          seat_price: formData.seat_price,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${trip ? "update" : "create"} trip`);
      }
  
      await res.json();
      setFormData({ route_id: "", bus_id: "", departure_time: "", seat_price: "" });
      onClear();
      toast.success(`${trip ? "Trip updated" : "Trip created"} successfully! 🎉`, {
        autoClose: 1000,
      });
      onTripSaved();
    } catch (error) {
      console.error(`Error ${trip ? "updating" : "creating"} trip:`, error);
      showToast("error", error.message);
    } finally {
      setLoading(false);
      dismissToast(toastId);
    }
  };
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {trip ? "Edit Trip" : "Create Trip"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Route</label>
          <select
            name="route_id"
            value={formData.route_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.origin_park.name} to {route.destination_park.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Bus</label>
          <select
            name="bus_id"
            value={formData.bus_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Bus</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.number_plate} (Capacity: {bus.total_seats})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Travel Date</label>
          <input
            type="datetime-local"
            name="departure_time"
            value={formData.departure_time}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Seat Price</label>
          <input
            type="number"
            name="seat_price"
            value={formData.seat_price}
            onChange={handleChange}
            className="w-full border rounded p-2"
            min="0"
            step="0.01"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Processing..." : trip ? "Update Trip" : "Create Trip"}
        </button>
        {trip && (
          <button
            type="button"
            onClick={onClear}
            className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
}