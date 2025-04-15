import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className='fixed bottom-10 right-6 md:bottom-12 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300 ease-in-out z-40 animate-fade-in'
          aria-label='Scroll to top'
          title='Back to top'
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
}
