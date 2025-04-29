import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import authFetch from "../utils/authFetch";

const dummyRoutes = [
  { id: 1, name: "Lagos to Abuja", from: "Lagos", to: "Abuja" },
  { id: 2, name: "Lagos to Port Harcourt", from: "Lagos", to: "Port Harcourt" },
  { id: 3, name: "Abuja to Kano", from: "Abuja", to: "Kano" },
  { id: 4, name: "Port Harcourt to Enugu", from: "Port Harcourt", to: "Enugu" },
];

const dummyBuses = [
  { id: 1, plateNumber: "ABC123", capacity: 18, status: "available" },
  { id: 2, plateNumber: "XYZ789", capacity: 14, status: "available" },
  { id: 3, plateNumber: "DEF456", capacity: 22, status: "maintenance" },
  { id: 4, plateNumber: "GHI789", capacity: 16, status: "available" },
];

const dummyScheduledTrips = [
  {
    id: 1,
    route: dummyRoutes[0], // Lagos to Abuja
    price: 5000,
    date: new Date("2025-04-20"),
    departureTime: "08:00",
    bus: dummyBuses[0], // ABC123
    bookings: 5,
  },
  {
    id: 2,
    route: dummyRoutes[1], // Lagos to Port Harcourt
    price: 6000,
    date: new Date("2025-04-21"),
    departureTime: "10:00",
    bus: dummyBuses[1], // XYZ789
    bookings: 0,
  },
  {
    id: 3,
    route: dummyRoutes[2], // Abuja to Kano
    price: 4500,
    date: new Date("2025-04-22"),
    departureTime: "12:00",
    bus: dummyBuses[3], // GHI789
    bookings: 0,
  },
  {
    id: 4,
    route: dummyRoutes[3], // Port Harcourt to Enugu
    price: 3000,
    date: new Date("2025-04-20"),
    departureTime: "09:00",
    bus: dummyBuses[0], // ABC123
    bookings: 0,
  },
  {
    id: 5,
    route: dummyRoutes[0], // Lagos to Abuja
    price: 5500,
    date: new Date("2025-04-19"),
    departureTime: "14:00",
    bus: dummyBuses[1], // XYZ789
    bookings: 0,
  },
];

const ParkAdminDashboard = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(null);
  const [departureTimes, setDepartureTimes] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);

  const [parkId, setParkId] = useState(null); // parkId now dynamic
  // const [routes, setRoutes] = useState([]);
  // const [buses, setBuses] = useState([]);
  // const [scheduledTrips, setScheduledTrips] = useState([]);

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

  const loadRoutes = async () => {
    try {
      const res = await authFetch(`/parks/${parkId}/routes/`);
      console.log("Routes response:", res); // Debugging line
      console.log("Routes response status:", res.status); // Debugging line
      if (res.ok) {
        const data = await res.json();
        setRoutes(data);
      } else {
        toast.error("Failed to load routes");
      }
    } catch (error) {
      toast.error("Error loading routes:", error);
    }
  };

  const loadBuses = async () => {
    try {
      const res = await authFetch(`/parks/${parkId}/buses/`);
      if (res.ok) {
        const data = await res.json();
        setBuses(data);
      } else {
        console.error("Failed to load buses");
      }
    } catch (error) {
      console.error("Error loading buses:", error);
    }
  };

  const loadTrips = async () => {
    try {
      const res = await authFetch(`/parks/${parkId}/trips/`);
      if (res.ok) {
        const tripsData = await res.json();

        // 🔥 Map backend trips into frontend expected format
        const mappedTrips = tripsData.map((trip) => ({
          id: trip.id,
          route: {
            name: `${trip.route.origin_park.name} ➔ ${trip.route.destination_park.name}`,
          },
          date: new Date(trip.departure_datetime),
          departureTime: new Date(trip.departure_datetime).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          ),
          bus: {
            plateNumber: trip.bus.number_plate,
            capacity: trip.bus.total_seats,
          },
          price: trip.seat_price,
          bookings: trip.bookings_count,
          seatsTaken: trip.seats_taken,
        }));

        setScheduledTrips(mappedTrips);
      } else {
        console.error("Failed to load trips");
      }
    } catch (error) {
      console.error("Error loading trips:", error);
    }
  };

  const resetForm = () => {
    setSelectedRoute(null);
    setPrice("");
    setDate(null);
    setDepartureTimes([]);
    setEditingTripId(null);
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

  const editTrip = (trip) => {
    setEditingTripId(trip.id);

    // Set selected route
    const matchingRoute = routes.find(
      (r) =>
        r.origin_park.name === trip.route.name.split("➔")[0].trim() &&
        r.destination_park.name === trip.route.name.split("➔")[1].trim()
    );
    setSelectedRoute(matchingRoute || null);

    // Set price
    setPrice(trip.price);

    // Set trip date
    setDate(new Date(trip.date)); // `trip.date` was already mapped from backend

    // Set departure time
    setDepartureTimes([
      {
        time: trip.departureTime ? formatBackendTime(trip.departureTime) : "",
        bus: buses.find((b) => b.number_plate === trip.bus.plateNumber) || null,
      },
    ]);
  };

  const formatBackendTime = (timeStr) => {
    // Convert "06:00 AM" format to "06:00"
    const parts = timeStr.split(" ");
    let [hour, minute] = parts[0].split(":");
    if (parts[1] === "PM" && hour !== "12") {
      hour = (parseInt(hour) + 12).toString();
    }
    if (parts[1] === "AM" && hour === "12") {
      hour = "00";
    }
    return `${hour.padStart(2, "0")}:${minute}`;
  };

  const deleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) {
      return;
    }

    try {
      const res = await authFetch(`/trips/${tripId}/delete/`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Trip deleted successfully!", { autoClose: 2000 });
        loadTrips(); // Refresh scheduled trips
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete trip.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Something went wrong.", { autoClose: 3000 });
    }
  };

  const submitTrips = async () => {
    if (!selectedRoute || !price || !date || departureTimes.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const tripsPayload = departureTimes.map((dt) => ({
        route_id: selectedRoute.id,
        bus_id: dt.bus.id,
        departure_datetime: new Date(
          `${date.toISOString().split("T")[0]}T${dt.time}:00`
        ).toISOString(),
        seat_price: parseFloat(price),
      }));

      let res;
      if (editingTripId) {
        // 🔥 If editing, update the existing trip
        res = await authFetch(`/trips/${editingTripId}/update/`, {
          method: "PATCH",
          body: JSON.stringify(tripsPayload[0]), // Only one trip at a time for editing
        });
      } else {
        // 🔥 If not editing, create new trips
        res = await authFetch(`/parks/${parkId}/trips/create/`, {
          method: "POST",
          body: JSON.stringify({ trips: tripsPayload }),
        });
      }

      const data = await res.json();

      if (res.ok) {
        if (editingTripId) {
          toast.success("Trip updated successfully!");
        } else {
          toast.success(
            `${data.created_trips.length} trip(s) scheduled successfully!`
          );
        }
        resetForm();
        loadTrips();
      } else {
        toast.error(data.errors?.join(", ") || "Failed to schedule trips");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmScheduleTrips = async () => {
    if (!selectedRoute || !price || !date || departureTimes.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const tripsPayload = departureTimes.map((dt) => ({
        route_id: selectedRoute.id,
        bus_id: dt.bus.id,
        departure_datetime: new Date(
          `${date.toISOString().split("T")[0]}T${dt.time}:00`
        ).toISOString(), // Proper ISO format
        seat_price: parseFloat(price),
      }));

      const res = await authFetch(`/parks/${parkId}/trips/create/`, {
        method: "POST",
        body: JSON.stringify({ trips: tripsPayload }),
      });

      if (res.ok) {
        const data = await res.json();
        const { created_trips, errors } = data;

        if (created_trips && created_trips.length > 0) {
          toast.success(
            `${created_trips.length} trip(s) scheduled successfully!`,
            {
              autoClose: 2000,
            }
          );
          resetForm();

          // Optionally: Refresh trips list here or add created trips to your scheduledTrips
        }

        if (errors && errors.length > 0) {
          errors.forEach((err) => toast.error(err, { autoClose: 3000 }));
        }

        setShowConfirmModal(false);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to schedule trips.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error scheduling trips:", error);
      toast.error("Something went wrong.", { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6'>
          Park Admin Dashboard
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              {editingTripId ? "Edit Trip" : "Schedule New Trips"}
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Route
                </label>
                <select
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  value={selectedRoute?.id || ""}
                  onChange={(e) => {
                    const routeId = e.target.value;
                    const route = routes.find(
                      (r) => r.id === parseInt(routeId)
                    );
                    if (route) {
                      setSelectedRoute({
                        id: route.id,
                        name: `${route.origin_park.name} ➔ ${route.destination_park.name}`, // 👈 build name manually
                        from: route.origin_park.name,
                        to: route.destination_park.name,
                      });
                    } else {
                      setSelectedRoute(null);
                    }
                  }}
                  disabled={
                    editingTripId &&
                    scheduledTrips.find((t) => t.id === editingTripId)
                      ?.bookings > 0
                  }
                >
                  <option value=''>Select a route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.origin_park.name} ➔ {route.destination_park.name}
                    </option>
                  ))}
                </select>
                {editingTripId &&
                  scheduledTrips.find((t) => t.id === editingTripId)?.bookings >
                    0 && (
                    <p className='text-sm text-red-600 mt-1'>
                      Route cannot be changed due to existing bookings.
                    </p>
                  )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Price per Seat (₦)
                </label>
                <input
                  type='number'
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder='Enter price'
                  min='0'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Trip Date
                </label>
                <div className='relative'>
                  <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    minDate={new Date()}
                    className='w-full p-2 border border-gray-300 rounded-md focus:border-2 focus:ring-2 focus:ring-blue-500'
                    placeholderText='Select date'
                    dateFormat='MMMM d, yyyy'
                    disabled={
                      editingTripId &&
                      scheduledTrips.find((t) => t.id === editingTripId)
                        ?.bookings > 0
                    }
                  />
                </div>
                {editingTripId &&
                  scheduledTrips.find((t) => t.id === editingTripId)?.bookings >
                    0 && (
                    <p className='text-sm text-red-600 mt-1'>
                      Date cannot be changed due to existing bookings.
                    </p>
                  )}
              </div>

              <div>
                <div className='flex justify-between items-center mb-1'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Departure Times
                  </label>
                  <button
                    type='button'
                    className='text-sm text-blue-600 hover:text-blue-800 font-medium'
                    onClick={addDepartureTime}
                  >
                    + Add Time
                  </button>
                </div>
                {editingTripId && departureTimes.length > 1 && (
                  <p className='text-sm text-gray-600 italic mb-2'>
                    Additional departure times will create new trips.
                  </p>
                )}
                {departureTimes.length === 0 ? (
                  <div className='text-sm text-gray-500 italic py-2'>
                    No departure times added yet
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {departureTimes.map((dt, index) => (
                      <div
                        key={index}
                        className='grid grid-cols-12 gap-2 items-center'
                      >
                        <div className='col-span-4'>
                          {index === 0 &&
                          editingTripId &&
                          scheduledTrips.find((t) => t.id === editingTripId)
                            ?.bookings > 0 ? (
                            <input
                              type='text'
                              className='w-full p-2 border border-gray-300 rounded-md bg-gray-100'
                              value={dt.time}
                              readOnly
                            />
                          ) : (
                            <select
                              className='w-full p-2 border border-gray-300 rounded-md'
                              value={dt.time}
                              onChange={(e) =>
                                updateDepartureTime(
                                  index,
                                  "time",
                                  e.target.value
                                )
                              }
                            >
                              <option value=''>Select time</option>
                              {Array.from({ length: 18 }, (_, i) => {
                                const hour = i + 6;
                                const ampm = hour >= 12 ? "PM" : "AM";
                                const displayHour =
                                  hour % 12 === 0 ? 12 : hour % 12;
                                const timeString = `${displayHour}:00 ${ampm}`;
                                const valueString = `${hour
                                  .toString()
                                  .padStart(2, "0")}:00`;
                                return (
                                  <option key={valueString} value={valueString}>
                                    {timeString}
                                  </option>
                                );
                              })}
                            </select>
                          )}
                          {index === 0 &&
                            editingTripId &&
                            scheduledTrips.find((t) => t.id === editingTripId)
                              ?.bookings > 0 && (
                              <p className='text-sm text-red-600 mt-1'>
                                Existing departure time cannot be changed due to
                                bookings.
                              </p>
                            )}
                        </div>
                        <div className='col-span-6'>
                          <select
                            className='w-full p-2 border border-gray-300 rounded-md'
                            value={dt.bus?.id || ""}
                            onChange={(e) => {
                              const busId = e.target.value;
                              const bus = buses.find(
                                (b) => b.id === parseInt(busId)
                              );
                              updateDepartureTime(index, "bus", bus || null);
                            }}
                          >
                            <option value=''>Select a bus</option>
                            {buses
                              .filter((bus) => bus.status === "available")
                              .map((bus) => (
                                <option key={bus.id} value={bus.id}>
                                  {bus.number_plate} ({bus.total_seats} seats)
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className='col-span-2'>
                          <button
                            type='button'
                            className='w-full p-2 text-red-600 hover:text-red-800'
                            onClick={() => removeDepartureTime(index)}
                            disabled={index === 0}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='pt-4'>
                <button
                  type='button'
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out'
                  onClick={submitTrips}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingTripId
                      ? "Updating..."
                      : "Scheduling..."
                    : editingTripId
                      ? "Update Trip"
                      : "Schedule Trips"}
                </button>
                {editingTripId && (
                  <button
                    type='button'
                    className='w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out'
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='hidden lg:block bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              Preview
            </h2>
            {!selectedRoute && !date && departureTimes.length === 0 ? (
              <div className='text-sm text-gray-500 italic'>
                Complete the form to see a preview of scheduled trips
              </div>
            ) : (
              <div className='space-y-4'>
                {selectedRoute && (
                  <div>
                    <h3 className='font-medium text-gray-800'>
                      {selectedRoute.name}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {selectedRoute.from} → {selectedRoute.to}
                    </p>
                  </div>
                )}
                {date && (
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Date:</p>
                    <p className='text-sm text-gray-600'>{formatDate(date)}</p>
                  </div>
                )}
                {price && (
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Price:</p>
                    <p className='text-sm text-gray-600'>
                      ₦{parseFloat(price).toLocaleString()}
                    </p>
                  </div>
                )}
                {departureTimes.length > 0 && (
                  <div>
                    <p className='text-sm font-medium text-gray-700 mb-1'>
                      Departures:
                    </p>
                    <ul className='space-y-2'>
                      {departureTimes.map((dt, index) => (
                        <li
                          key={index}
                          className='text-sm text-gray-600 flex justify-between'
                        >
                          <span>
                            {dt.time} -{" "}
                            {dt.bus
                              ? `${dt.bus.number_plate}`
                              : "No bus selected"}
                          </span>
                          {dt.bus && (
                            <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                              {dt.bus.capacity} seats
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className='mt-8 bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>
            Scheduled Trips
          </h2>
          {scheduledTrips.length === 0 ? (
            <div className='text-sm text-gray-500 italic'>
              No trips scheduled yet
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Route
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Time
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Bus
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Price
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Bookings
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {scheduledTrips.map((trip) => (
                    <tr key={trip.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {trip.route.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatDate(trip.date)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {trip.departureTime}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {trip.bus.plateNumber} ({trip.bus.capacity})
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        ₦{trip.price.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {trip.bookings} bookings ({trip.seatsTaken} seats taken)
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <button
                          onClick={() => editTrip(trip)}
                          className='text-blue-600 hover:text-blue-800 mr-3'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTrip(trip.id)}
                          className='text-red-600 hover:text-red-800'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50'
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className='bg-white rounded-lg p-6 max-w-md w-full'
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Confirm {editingTripId ? "Update" : "Schedule"} Trip
              </h3>
              <div className='text-sm text-gray-700 mb-4'>
                <p>
                  <strong>Route:</strong> {selectedRoute?.name}
                </p>
                <p>
                  <strong>Date:</strong> {date ? date.toLocaleDateString() : ""}
                </p>
                <p>
                  <strong>Price per Seat:</strong> ₦{price}
                </p>
                <p>
                  <strong>Departure Times:</strong>
                </p>
                <ul className='list-disc list-inside mb-4 max-h-40 overflow-auto'>
                  {departureTimes.map((dt, index) => (
                    <li key={index}>
                      {dt.time} -{" "}
                      {dt.bus ? dt.bus.plateNumber : "No bus selected"} (
                      {dt.bus ? dt.bus.capacity : 0} seats)
                    </li>
                  ))}
                </ul>
              </div>
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  className='px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none'
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none'
                  onClick={confirmScheduleTrips}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingTripId
                      ? "Updating..."
                      : "Scheduling..."
                    : editingTripId
                      ? "Update"
                      : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParkAdminDashboard;
