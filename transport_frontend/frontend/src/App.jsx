import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
// import AuthModal from "./components/AuthModal"; // Import the modal component
import AuthPage from "./components/AuthPage";
import ChangeBooking from "./sections/ChangeBooking";
import Home from "./Pages/Home";
import NavBar from "./components/NavBar";
import SeatAvailability from "./Pages/SeatAvailability";
import ContactSupport from "./Pages/ContactSupport";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ticket from "./Pages/Ticket";
import TravelHistory from "./Pages/TravelHistory";
import TripDashboard from "./components/admin/TripDashboard";
import AboutUs from "./Pages/AboutUs";
export default function App() {
  return (
    <>
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/auth'
          element={
            <AuthPage isOpen={true} onClose={() => window.history.back()} />
          }
        />
        <Route path='/modify-bookings' element={<ChangeBooking />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/check-availability' element={<SeatAvailability />} />
        <Route path='/check-ticket' element={<Ticket />} />
        <Route path='/contact-support' element={<ContactSupport />} />
        <Route path='/travel-history' element={<TravelHistory />} />
        <Route path='/trip-dashboard' element={<TripDashboard />} />
      </Routes>
      <Footer />
    </>
  );
}
