import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
// import AuthModal from "./components/AuthModal"; // Import the modal component
import AuthPage from "./components/AuthPage";
import ChangeBooking from "./sections/ChangeBooking";
import Home from "./Pages/Home";
import NavBar from "./components/NavBar";
import SeatAvailability from "./Pages/SeatAvailability";

export default function App() {
  return (
    <>
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
        <Route path='/check-availability' element={<SeatAvailability />} />
      </Routes>
      <Footer />
    </>
  );
}
