import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import authFetch from "../../utils/authFetch";
import TripList from "./TripList";
import TripForm from "./TripForm";
import { showToast } from "../../utils/toastUtils";

export default function TripDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [park, setPark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripsUpdated, setTripsUpdated] = useState(0);

  useEffect(() => {
    const fetchPark = async () => {
      if (!isAuthenticated || !user) {
        setError("Please log in to access this page.");
        showToast("error", "Please log in to access this page.");
        setLoading(false);
        return;
      }

      if (user.role !== "park_admin") {
        
        setError("Access Denied: Only park admins can access this page.");
        showToast("error", "Access Denied: Only park admins can access this page.");
        setLoading(false);
        return;
      }

      if (!user.managed_parks || user.managed_parks.length === 0) {
        setError("No parks assigned to this admin.");
        showToast("error", "No parks assigned to this admin.");
        setLoading(false);
        return;
      }

      setPark(user.managed_parks[0]);
      setLoading(false);
    };

    fetchPark();
  }, [user, isAuthenticated]);

  const refreshTrips = () => {
    setTripsUpdated((prev) => prev + 1);
  };

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Trip Management - {park?.name || "Unknown Park"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TripList parkId={park?.id} onEdit={setSelectedTrip} refreshTrigger={tripsUpdated} />
        <TripForm parkId={park?.id} trip={selectedTrip} onClear={() => setSelectedTrip(null)} onTripSaved={refreshTrips} />
      </div>
    </div>
  );
}