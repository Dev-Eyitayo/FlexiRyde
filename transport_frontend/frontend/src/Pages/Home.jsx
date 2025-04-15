import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import NavBar from "./../components/NavBar";
import BookHero from "./../sections/BookHero";
import { About } from "./../sections/About";
import FAQSection from "./../sections/FAQSection";
import TestimonialSection from "./../sections/TestimonialSection";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import BackToTop from "../components/BackToTop";

export default function Home() {
  const controls = useAnimation();
  const location = useLocation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });

    const handleScroll = () => {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.3 } });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={controls}>
        <BookHero />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={controls}>
        <About />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={controls}>
        <TestimonialSection />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={controls}>
        <FAQSection />
      </motion.div>
      <BackToTop />
    </div>
  );
}
