import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
// import NavBar from "./components/NavBar";
// import BookHero from "./sections/BookHero";
// import { About } from "./sections/About";
// import FAQSection from "./sections/FAQSection";
// import TestimonialSection from "./sections/TestimonialSection";
import Footer from "./components/Footer";
// import AuthModal from "./components/AuthModal"; // Import the modal component
import AuthPage from "./components/AuthPage";
import ChangeBooking from "./sections/ChangeBooking";
import Home from "./Pages/Home";
import NavBar from "./components/NavBar";


export default function App() {
  // const controls = useAnimation();
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });

  //   const handleScroll = () => {
  //     controls.start({ opacity: 1, y: 0, transition: { duration: 0.3 } });
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [controls]);

  return (
    <>
    <NavBar/>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/auth" element={<AuthPage isOpen={true} onClose={() => window.history.back()} />} />
        <Route path="/modify-booking" element={<ChangeBooking />} />
      </Routes>
    <Footer />
    </>
  );
}
