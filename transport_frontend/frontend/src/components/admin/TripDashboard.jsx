import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import authFetch from "../../utils/authFetch";
import TripList from "./TripList";
import TripForm from "./TripForm";

export default function TripDashboard() {
  const { user } = useAuth();
  const [selectedTrip, setSelectedTrip] = useState(null);

  if (!user || user.role !== "park_admin") {
    return <div className="text-red-500">Access Denied</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Trip Management - {user.managed_parks[0]?.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TripList parkId={user.managed_parks[0]?.id} onEdit={setSelectedTrip} />
        <TripForm parkId={user.managed_parks[0]?.id} trip={selectedTrip} onClear={() => setSelectedTrip(null)} />
      </div>
    </div>
  );
}