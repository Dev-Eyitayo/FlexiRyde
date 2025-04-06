import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import heroBg from "../assets/heroBg.jpg";
import { BookingInput } from "../components/BookingInput";
import { useNavigate } from "react-router-dom";

export default function BookHero() {
  const navigate = useNavigate();

  return (
    <div
      className='relative bg-cover bg-center h-[600px] pb-0 flex items-center justify-center text-gray-700'
      id='bookhero'
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className='absolute inset-0 bg-black/60'></div>
      <div className='relative container text-center px-4 w-full flex flex-col items-center justify-center'>
        <h1 className='md:text-4xl text-2xl text-white pb-2 font-bold'>
          Travel smarter. Book your ride with ease and confidence!
        </h1>
        <BookingInput
          submitType={"Check Availability"}
          onClick={() => navigate("/check-availability")}
        />
      </div>
    </div>
  );
}
