import { useState, useRef, useEffect, useContext } from "react"; // Import necessary hooks from React
import {
  FaHeadphones,
  FaUser,
  FaBars,
  FaTimes,
  FaAddressCard,
  FaBus,
} from "react-icons/fa"; // Import icons from react-icons
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate for routing
import { IoMdArrowDropdown } from "react-icons/io"; // Import dropdown icon
import { useAuth } from "../context/AuthContext"; // Import authentication context
import logo from "../assets/logo.png"; // Import logo image
import LogoutConfirmModal from "./LogoutConfirmModal";
import { toast } from "react-toastify";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage sidebar menu visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const dropdownRef = useRef(null); // Reference for dropdown to handle outside clicks
  const mobileDropdownRef = useRef(null); // Reference for mobile dropdown
  const sidebarRef = useRef(null); // Reference for sidebar
  const navigate = useNavigate(); // Hook to programmatically navigate
  const { isAuthenticated, user, logout } = useAuth(); // Destructure authentication context
  const [showLogoutModal, setShowLogoutModal] = useState(false); //Do NOT TOUCH, YOUNG MAN!!

  // Function to handle user logout
  // const handleLogout = () => {
  //   const confirmLogout = window.confirm("Are you sure you want to log out?");
  //   if (confirmLogout) {
  //     toast.success("Logout successful!"); // Show toast first
  //     setTimeout(() => logout(), 2000); // Delay logout to allow toast to render
  //   }
  // };

  // Effect to close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false); // Close dropdown if clicked outside
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside); // Add event listener if dropdown is open
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, [isDropdownOpen]);

  // Effect to close sidebar when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close sidebar if clicked outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside); // Add event listener for sidebar
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, []);

  return (
    <nav className='bg-white shadow-md p-4 sticky top-0 z-50'>
      {" "}
      {/* Navigation bar styling */}
      <div className='container mx-auto flex items-center justify-between'>
        {" "}
        {/* Flex container for layout */}
        <button
          className='flex items-center space-x-6 cursor-pointer'
          onClick={() => navigate("/")} // Navigate to home on logo click
        >
          <img src={logo} alt='Brand Logo' className='md:h-12 h-10' />{" "}
          {/* Brand logo */}
        </button>
        <div className='hidden md:flex gap-4 items-center space-x-6'>
          {" "}
          {/* Desktop navigation items */}
          <button
            onClick={() => navigate("/#bookhero")} // Navigate to book ride section
            className='flex items-center text-gray-700 cursor-pointer hover:text-red-500'
          >
            <FaBus className='mr-1' size={20} /> {/* Bus icon */}
            <span className='font-semibold ml-1 text-base'>Book Ride</span>{" "}
            {/* Book Ride text */}
          </button>
          <button
            onClick={() => navigate("/#about")} // Navigate to about section
            className='flex items-center text-gray-700 hover:text-red-500'
          >
            <FaAddressCard className='mr-1' size={20} /> {/* About icon */}
            <span className='font-semibold ml-1 hover:cursor-pointer text-base'>
              About Us
            </span>{" "}
            {/* About Us text */}
          </button>
          <a
            href='#' // Placeholder for contact support link
            className='flex items-center text-gray-700 hover:text-red-500'
          >
            <FaHeadphones className='mr-1' size={20} /> {/* Headphones icon */}
            <span className='font-semibold ml-1 text-base'>
              Contact Support
            </span>{" "}
            {/* Contact Support text */}
          </a>
          <div className='relative'>
            {" "}
            {/* Dropdown for user options */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
              className='flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 transition-all focus:outline-none'
            >
              <FaUser size={22} className='text-gray-700' /> {/* User icon */}
              <IoMdArrowDropdown className='ml-1 text-gray-700' />{" "}
              {/* Dropdown arrow */}
            </button>
            {isDropdownOpen && ( // Render dropdown if open
              <div
                ref={dropdownRef} // Reference for dropdown
                className='absolute right-0 py-4 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg'
              >
                {isAuthenticated && ( // Show username if authenticated
                  <div className='px-4 py-2 text-lg font-semibold text-gray-600'>
                    Hi, {user?.username || user?.email?.split("@")[0]}{" "}
                    {/* Display username or email */}
                  </div>
                )}
                <button
                  onClick={() => navigate("/modify-bookings")} // Navigate to modify bookings
                  className='block px-4 text-start w-full py-2 text-gray-700 hover:bg-gray-100 h transition hover:cursor-pointer'
                >
                  Change Travel Date
                </button>
                <hr className='my-1 border-gray-200' /> {/* Divider */}
                <a
                  href='#' // Placeholder for show my ticket link
                  className='block px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                >
                  Show My Ticket
                </a>
                <hr className='my-1 border-gray-200' /> {/* Divider */}
                <a
                  href='#' // Placeholder for travel history link
                  className='block px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                >
                  Travel History
                </a>
                <hr className='my-1 border-gray-200' /> {/* Divider */}
                {isAuthenticated ? ( // Show logout button if authenticated
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className='block px-4 py-2 text-start w-full text-red-600 hover:bg-red-100 transition hover:cursor-pointer'
                  >
                    Logout
                  </button>
                ) : (
                  // Show sign up/login button if not authenticated
                  <button
                    onClick={() => navigate("/auth")} // Navigate to auth page
                    className='block px-4 py-2 text-start w-full text-gray-700 hover:bg-gray-100 transition'
                  >
                    Sign Up/Log In
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className='md:hidden flex flex-row gap-3'>
          {" "}
          {/* Mobile navigation items */}
          <div className='relative' ref={mobileDropdownRef}>
            {" "}
            {/* Mobile dropdown for user options */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle mobile dropdown visibility
              className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all focus:outline-none'
            >
              <FaUser size={16} className='text-gray-700' /> {/* User icon */}
            </button>
            {isDropdownOpen && ( // Render mobile dropdown if open
              <div
                ref={mobileDropdownRef} // Reference for mobile dropdown
                className='absolute right-0 py-4 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg'
              >
                <button
                  onClick={() => navigate("/modify-bookings")} // Navigate to modify bookings
                  className='block w-full text-start px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                >
                  Change Travel Date
                </button>
                <hr className='my-1 border-gray-200' /> {/* Divider */}
                <a
                  href='#' // Placeholder for show my ticket link
                  className='block px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                >
                  Show My Ticket
                </a>
                <hr className='my-1 border-gray-200' /> {/* Divider */}
                <a
                  href='#' // Placeholder for travel history link
                  className='block px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                >
                  Travel History
                </a>
                <hr className='my-1 border-gray-200' /> {/* Divider */}
                <button
                  onClick={() => navigate("/auth")} // Navigate to auth page
                  className='block px-4 py-2 text-start w-full text-gray-700 hover:bg-gray-100 transition'
                >
                  Sign Up/Log In
                </button>
              </div>
            )}
          </div>
          <button
            className='md:hidden text-gray-700 focus:outline-none'
            onClick={() => setIsMenuOpen(true)} // Open sidebar menu
          >
            <FaBars size={24} /> {/* Hamburger icon for mobile menu */}
          </button>
        </div>
      </div>
      <div
        ref={sidebarRef} // Reference for sidebar
        className={`fixed top-0 right-0 h-full w-64 backdrop-blur-lg bg-black/40 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out p-4`}
      >
        <button
          className='absolute top-4 right-4 text-gray-700 focus:outline-none'
          onClick={() => setIsMenuOpen(false)} // Close sidebar menu
        >
          <FaTimes className='mt-4 text-white' size={24} /> {/* Close icon */}
        </button>
        <div className='mt-24 flex flex-col gap-4 space-y-6'>
          {" "}
          {/* Sidebar navigation items */}
          <button
            onClick={() => navigate("/#bookhero")} // Navigate to book ride section
            className='text-white hover:text-blue-500 flex gap-2 items-center'
          >
            <FaBus className='mr-2' size={18} /> {/* Bus icon */}
            <span className='font-semibold'>Book Ride</span>{" "}
            {/* Book Ride text */}
          </button>
          <a
            href='#about' // Navigate to about section
            className='text-white hover:text-blue-500 flex gap-2 items-center'
          >
            <FaAddressCard className='mr-2' size={18} /> {/* About icon */}
            <span className='font-semibold'>About Us</span>{" "}
            {/* About Us text */}
          </a>
          <a
            href='#' // Placeholder for contact support link
            className='text-white hover:text-blue-500 flex gap-2 items-center'
          >
            <FaHeadphones className='mr-2' size={18} /> {/* Headphones icon */}
            <span className='font-semibold'>Contact Support</span>{" "}
            {/* Contact Support text */}
          </a>
        </div>
      </div>
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout(); // Logout the user
          toast.success("Logout successful!"); // Show success toast message
          setShowLogoutModal(false); // Close modal
        }}
      />
    </nav>
  );
}
