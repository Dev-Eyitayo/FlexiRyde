import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import authFetch from "../../utils/authFetch";
import TripList from "./TripList";
import TripForm from "./TripForm";

export default function TripDashboard() {
    const { user, isAuthenticated } = useAuth();
    const [selectedTrip, setSelectedTrip] = useState(null);
  
    // Add loading state to handle async user fetching
    if (!isAuthenticated || !user) {
      return <div className="text-gray-500">Please log in to access this page.</div>;
    }
  
    // Check if user is a park_admin and has managed parks
    if (user.role !== "park_admin") {
      return <div className="text-red-500">Access Denied: Only park admins can access this page.</div>;
    }
  
    if (!user.managed_parks || user.managed_parks.length === 0) {
      return <div className="text-red-500">No parks assigned to this admin.</div>;
    }
  
    const parkId = user.managed_parks[0]?.id;
    const parkName = user.managed_parks[0]?.name;
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Trip Management - {parkName || "Unknown Park"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TripList parkId={parkId} onEdit={setSelectedTrip} />
          <TripForm parkId={parkId} trip={selectedTrip} onClear={() => setSelectedTrip(null)} />
        </div>
      </div>
    );
  }