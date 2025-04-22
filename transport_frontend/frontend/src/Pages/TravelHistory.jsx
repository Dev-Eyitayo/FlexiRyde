import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import authFetch from "../utils/authFetch";
import { useNavigate } from "react-router-dom";

import FilterButtons from "../components/TravelHistory/FilterButtons";
import TripCard from "../components/TravelHistory/TripCard";
import Pagination from "../components/TravelHistory/Pagination";
import CancelModal from "../components/TravelHistory/CancelModal";

export default function TravelHistory() {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [cancelTrip, setCancelTrip] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const tripsPerPage = 5; // Number of trips per page
  const navigate = useNavigate();

  // Fetch bookings
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await authFetch("/bookings/");
        const data = await response.json();

        const formatted = data.map((booking) => {
          const trip = booking.trip || {};
          const route = trip.route || {};
          const datetime = new Date(trip.departure_datetime);
          const createdAt = new Date(booking.created_at);

          return {
            id: booking.id,
            from: route.origin_park?.name || "—",
            fromCity: route.origin_city?.name || "",
            to: route.destination_park?.name || "—",
            toCity: route.destination_city?.name || "",
            date: datetime.toLocaleDateString("en-NG", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            time: datetime.toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            seats: booking.seats ?? booking.seat_count ?? "—",
            price: `₦${Number(booking.price).toLocaleString()}`,
            bookingRef: booking.ref_number ?? booking.payment_reference,
            status: booking.status?.toLowerCase() || "confirmed",
            originalBooking: booking,
            datetime,
            createdAt,
          };
        });

        // Sort trips: confirmed first (by created_at, newest first), then others (by departure_datetime, newest first)
        formatted.sort((a, b) => {
          if (a.status === "confirmed" && b.status !== "confirmed") return -1;
          if (a.status !== "confirmed" && b.status === "confirmed") return 1;
          if (a.status === "confirmed" && b.status === "confirmed") {
            return b.createdAt - a.createdAt;
          }
          return b.datetime - a.datetime;
        });

        setTrips(formatted);
        setCurrentPage(1); // Reset to first page when data is fetched
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchTrips();
  }, []);

  // Helper to check if cancellation is allowed (more than 12 hours until departure)
  const canCancel = (trip) => {
    const now = new Date();
    const departure = new Date(trip.datetime);
    const hoursUntilDeparture = (departure - now) / (1000 * 60 * 60);
    return hoursUntilDeparture > 12;
  };

  // Filtering and Pagination
  const filteredTrips =
    filter === "all" ? trips : trips.filter((trip) => trip.status === filter);

  // Calculate pagination data
  const totalTrips = filteredTrips.length;
  const totalPages = Math.ceil(totalTrips / tripsPerPage);
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  // Cancel logic
  const handleCancelClick = (trip) => {
    if (!canCancel(trip)) {
      toast.error("Cannot cancel bookings within 12 hours of departure.");
      return;
    }
    setCancelTrip(trip);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (!cancelTrip?.id) {
      toast.error("Invalid trip selected for cancellation.");
      setShowModal(false);
      return;
    }

    try {
      const response = await authFetch(`/bookings/${cancelTrip.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: "cancelled" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === cancelTrip.id ? { ...trip, status: "cancelled" } : trip
          )
        );
        toast.success(
          `Trip to ${cancelTrip.to} cancelled successfully! Seats are now available for others.`
        );
        setCurrentPage(1); // Reset to first page after cancellation
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.non_field_errors?.[0] ||
          errorData.detail ||
          errorData.message ||
          "Unknown error";
        toast.error(`Failed to cancel trip: ${errorMessage}`);
      }
    } catch (err) {
      console.error("Cancellation error:", err);
      toast.error(`Error occurred during cancellation: ${err.message}`);
    } finally {
      setShowModal(false);
    }
  };

  // View ticket handler
  const handleViewTicket = (booking) => {
    navigate("/check-ticket", { state: { booking } });
  };

  return (
    <div className='min-h-screen bg-gray-200/30 px-4 py-10'>
      <div className='max-w-5xl mx-auto'>
        {/* Title */}
        <h1 className='text-2xl md:text-3xl font-bold mb-6'>Travel History</h1>

        {/* Filter Buttons */}
        <FilterButtons
          filter={filter}
          setFilter={(type) => {
            setFilter(type);
            setCurrentPage(1);
          }}
        />

        {/* Trip List */}
        {currentTrips.length === 0 ? (
          <p className='text-center text-gray-500 mt-10'>
            No trips found for this status.
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {currentTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                canCancel={canCancel}
                onCancelClick={handleCancelClick}
                onViewTicket={handleViewTicket}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Cancel Modal */}
        <CancelModal
          show={showModal}
          trip={cancelTrip}
          onClose={() => setShowModal(false)}
          onConfirm={confirmCancel}
        />
      </div>
    </div>
  );
}
