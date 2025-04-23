import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
// import AuthModal from "./components/AuthModal"; // Import the modal component
// import AuthPage from "./pages/AuthPage";
import AuthPage from "./Pages/AuthPage";
import ChangeBooking from "./Pages/ChangeBooking";
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
import ParkAdminDashboard from "./Pages/ParkAdminDashboard";
import ModalWrapper from "./components/Authentication/Modalwrapper";
import PasswordResetConfirmForm from "./components/Authentication/PasswordResetConfirmForm";

export default function App() {
  return (
    <>
      <ToastContainer
        position='top-right' // Position of the toast
        autoClose={2000} // Auto-close after 5 seconds
        hideProgressBar={false} // Show progress bar
        newestOnTop={true} // New toasts appear on top
        closeOnClick // Allow closing by clicking
        pauseOnHover // Pause timer on hover
        draggable // Allow dragging the toast
        toastClassName='rounded-lg shadow-md' // Custom styling
      />
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
        <Route path='/trip-dashboard' element={<ParkAdminDashboard />} />
        <Route
          path='/reset-password/:uid/:token'
          element={
            <ModalWrapper isOpen={true} onClose={() => window.history.back()}>
              <PasswordResetConfirmForm onClose={() => window.history.back()} />
            </ModalWrapper>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}
