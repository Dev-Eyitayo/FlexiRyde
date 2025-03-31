import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import NavBar from "./components/NavBar";
import BookHero from "./sections/BookHero";
import { About } from "./sections/About";
import FAQSection from "./sections/FAQSection";
import TestimonialSection from "./sections/TestimonialSection";
import Footer from "./sections/Footer";

export default function App() {
  const controls = useAnimation();

  useEffect(() => {
    // Trigger animation on mount
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });

    const handleScroll = () => {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.3 } });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  return (
    <>
      <NavBar />

      {/* Smooth Scrolling Sections */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={controls}>
        <BookHero />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={controls}>
        <About />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={controls}>
        <FAQSection />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={controls}>
        <TestimonialSection />
      </motion.div>
      
      <Footer/>
    </>
  );
}
