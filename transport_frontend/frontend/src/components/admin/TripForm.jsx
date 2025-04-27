import { useState, useEffect } from "react";
import authFetch from "../..//utils/authFetch"; // Adjust your import
import { toast } from "react-toastify";

const ParkAdminDashboard = () => {
  const [parkId, setParkId] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [scheduledTrips, setScheduledTrips] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(null);
  const [departureTimes, setDepartureTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUserProfile = async () => {
    try {
      const res = await authFetch(`/auth/user/`);
      if (res.ok) {
        const data = await res.json();
        const parks = data.managed_parks;
        if (parks.length > 0) {
          setParkId(parks[0].id);
        } else {
          toast.error("No park assigned to you.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading user profile.");
    }
  };

  const loadRoutes = async () => {
    try {
      const res = await authFetch(`/parks/${parkId}/routes/`);
      if (res.ok) {
        const data = await res.json();
        setRoutes(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadBuses = async () => {
    try {
      const res = await authFetch(`/parks/${parkId}/buses/`);
      if (res.ok) {
        const data = await res.json();
        setBuses(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadTrips = async () => {
    try {
      const res = await authFetch(`/parks/${parkId}/trips/`);
      if (res.ok) {
        const data = await res.json();
        setScheduledTrips(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (parkId) {
      loadRoutes();
      loadBuses();
      loadTrips();
    }
  }, [parkId]);

  const resetForm = () => {
    setSelectedRoute(null);
    setPrice("");
    setDate(null);
    setDepartureTimes([]);
  };

  const addDepartureTime = () => {
    setDepartureTimes([...departureTimes, { time: "", bus: null }]);
  };

  const updateDepartureTime = (index, field, value) => {
    const updatedTimes = [...departureTimes];
    updatedTimes[index][field] = value;
    setDepartureTimes(updatedTimes);
  };

  const removeDepartureTime = (index) => {
    const updatedTimes = departureTimes.filter((_, i) => i !== index);
    setDepartureTimes(updatedTimes);
  };

  const submitTrips = async () => {
    if (!selectedRoute || !price || !date || departureTimes.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const incompleteTimes = departureTimes.some((dt) => !dt.time || !dt.bus);
    if (incompleteTimes) {
      toast.error("Please complete all departure time fields");
      return;
    }

    const tripsPayload = departureTimes.map((dt) => ({
      route_id: selectedRoute.id,
      bus_id: dt.bus.id,
      departure_datetime: new Date(
        `${date.toISOString().split("T")[0]}T${dt.time}:00`
      ).toISOString(),
      seat_price: parseFloat(price),
    }));

    setIsSubmitting(true);

    try {
      const res = await authFetch(`/parks/${parkId}/trips/create/`, {
        method: "POST",
        body: JSON.stringify({ trips: tripsPayload }),
      });

      if (res.ok) {
        const data = await res.json();
        const { created_trips, errors } = data;

        if (created_trips && created_trips.length > 0) {
          toast.success(`${created_trips.length} trip(s) scheduled successfully!`);
          resetForm();
          loadTrips(); // Refresh trips
        }

        if (errors && errors.length > 0) {
          errors.forEach((err) => toast.error(err));
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to schedule trips");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Park Admin Dashboard</h1>

      {/* Form Section */}
      <div className="bg-white rounded-lg p-4 shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Schedule New Trips</h2>

        <div className="grid gap-4">
          {/* Route */}
          <div>
            <label className="block mb-1">Route</label>
            <select
              className="w-full border rounded p-2"
              value={selectedRoute?.id || ""}
              onChange={(e) => {
                const routeId = parseInt(e.target.value);
                const route = routes.find((r) => r.id === routeId);
                setSelectedRoute(route || null);
              }}
            >
              <option value="">Select a route</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.origin_park.name} ➔ {route.destination_park.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1">Price per Seat (₦)</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              placeholder="Enter price"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1">Trip Date</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={date ? date.toISOString().split("T")[0] : ""}
              onChange={(e) => setDate(new Date(e.target.value))}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Departure Times */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label>Departure Times</label>
              <button
                type="button"
                className="text-blue-500"
                onClick={addDepartureTime}
              >
                + Add
              </button>
            </div>
            {departureTimes.map((dt, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                {/* Time */}
                <div className="col-span-5">
                  <select
                    className="w-full border rounded p-2"
                    value={dt.time}
                    onChange={(e) =>
                      updateDepartureTime(index, "time", e.target.value)
                    }
                  >
                    <option value="">Select Time</option>
                    {Array.from({ length: 18 }, (_, i) => {
                      const hour = i + 6;
                      const timeString = `${hour.toString().padStart(2, "0")}:00`;
                      return (
                        <option key={timeString} value={timeString}>
                          {timeString}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Bus */}
                <div className="col-span-5">
                  <select
                    className="w-full border rounded p-2"
                    value={dt.bus?.id || ""}
                    onChange={(e) => {
                      const busId = parseInt(e.target.value);
                      const bus = buses.find((b) => b.id === busId);
                      updateDepartureTime(index, "bus", bus || null);
                    }}
                  >
                    <option value="">Select Bus</option>
                    {buses.map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.number_plate} (Capacity: {bus.total_seats})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remove Button */}
                <div className="col-span-2 flex justify-center items-center">
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => removeDepartureTime(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="button"
            className="w-full bg-blue-600 text-white rounded p-2 mt-4"
            onClick={submitTrips}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Schedule Trips"}
          </button>
        </div>
      </div>

      {/* Scheduled Trips Section */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">Scheduled Trips</h2>
        {scheduledTrips.length === 0 ? (
          <p>No trips scheduled yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Bus</th>
                  <th>Price</th>
                  <th>Available Seats</th>
                </tr>
              </thead>
              <tbody>
                {scheduledTrips.map((trip) => (
                  <tr key={trip.id}>
                    <td>{trip.route.origin_park.name} ➔ {trip.route.destination_park.name}</td>
                    <td>{formatDate(trip.departure_datetime)}</td>
                    <td>{formatTime(trip.departure_datetime)}</td>
                    <td>{trip.bus.number_plate} ({trip.bus.total_seats})</td>
                    <td>₦{trip.seat_price.toLocaleString()}</td>
                    <td>{trip.available_seats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkAdminDashboard;
