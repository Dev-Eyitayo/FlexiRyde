// src/components/NavBar.jsx
import { useState, useRef, useEffect } from "react";
import {
  FaHeadphones,
  FaUser,
  FaBars,
  FaTimes,
  FaAddressCard,
  FaBus,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { toast } from "react-toastify";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const desktopToggleRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Debug authentication state
  useEffect(() => {
    console.log("NavBar - isAuthenticated:", isAuthenticated);
    console.log("NavBar - user:", user);
    console.log("NavBar - localStorage:", {
      access: localStorage.getItem("access"),
      refresh: localStorage.getItem("refresh"),
      user: localStorage.getItem("user"),
    });
  }, [isAuthenticated, user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDesktopDropdown = () => {
    setIsDesktopDropdownOpen((prev) => !prev);
    setIsMobileDropdownOpen(false);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen((prev) => !prev);
    setIsDesktopDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        desktopToggleRef.current &&
        desktopDropdownRef.current &&
        !desktopToggleRef.current.contains(event.target) &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setIsDesktopDropdownOpen(false);
      }
      if (
        mobileToggleRef.current &&
        mobileDropdownRef.current &&
        !mobileToggleRef.current.contains(event.target) &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsMobileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className='bg-white shadow-md p-3 sticky top-0 z-50'>
      <div className='container mx-auto flex items-center justify-between'>
        <button
          className='flex items-center space-x-6 cursor-pointer'
          onClick={() => navigate("/")}
        >
          <img src={logo} alt='Brand Logo' className='md:h-10 h-8' />
        </button>
        <div className='hidden md:flex gap-4 items-center space-x-6'>
          <NavLink
            to='/#bookhero'
            className='flex items-center text-gray-700 cursor-pointer hover:text-red-500'
          >
            <FaBus className='mr-1' size={20} />
            <span className='font-semibold ml-1 text-base'>Book Ride</span>
          </NavLink>
          <NavLink
            to='/#about'
            className='flex items-center text-gray-700 hover:text-red-500 hover:cursor-pointer'
          >
            <FaAddressCard className='mr-1' size={20} />
            <span className='font-semibold ml-1 text-base'>About Us</span>
          </NavLink>
          <NavLink
            to='/contact-support'
            className='flex items-center text-gray-700 hover:text-red-500 cursor-pointer'
          >
            <FaHeadphones className='mr-1' size={20} />
            <span className='font-semibold ml-1 text-base'>
              Contact Support
            </span>
          </NavLink>
          <div className='relative'>
            <button
              ref={desktopToggleRef}
              onClick={toggleDesktopDropdown}
              className='flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-all focus:outline-none'
              aria-expanded={isDesktopDropdownOpen}
              aria-haspopup='true'
            >
              <FaUser size={18} className='text-gray-700' />
              <IoMdArrowDropdown
                className={`ml-1 text-gray-700 transition-transform ${isDesktopDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isDesktopDropdownOpen && (
              <div
                ref={desktopDropdownRef}
                className='absolute right-0 py-1 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg'
              >
                {isAuthenticated && (
                  <div className='px-4 py-2 text-lg font-semibold text-gray-600'>
                    Hi, {user?.first_name || user?.email?.split("@")[0]} 👋
                  </div>
                )}
                {isAuthenticated && user?.role === 'park_admin' && (
                  <>
                    <button
                      onClick={() => {
                        navigate("/trip-dashboard");
                        setIsDesktopDropdownOpen(false);
                      }}
                      className='block px-4 text-start w-full py-2 text-gray-700 hover:bg-gray-100 transition hover:cursor-pointer'
                    >
                      Manage Trips
                    </button>
                    <hr className='my-1 border-gray-200' />
                  </>
                )}
                <button
                  onClick={() => {
                    navigate("/modify-bookings");
                    setIsDesktopDropdownOpen(false);
                  }}
                  className='block px-4 text-start w-full py-2 text-gray-700 hover:bg-gray-100 h transition hover:cursor-pointer'
                >
                  Change Travel Date
                </button>
                <hr className='my-1 border-gray-200' />
                <button
                  onClick={() => {
                    navigate("/check-ticket");
                    setIsDesktopDropdownOpen(false);
                  }}
                  className='block px-4 py-2 w-full text-start text-gray-700 hover:bg-gray-100 transition'
                >
                  Show My Ticket
                </button>
                <hr className='my-1 border-gray-200' />
                <button
                  onClick={() => navigate("/travel-history")}
                  className='block px-4 py-2 w-full text-start text-gray-700 hover:bg-gray-100 transition'
                >
                  Travel History
                </button>
                <hr className='my-1 border-gray-200' />
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className='block px-4 py-2 text-start w-full text-red-600 hover:bg-red-100 transition hover:cursor-pointer'
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/auth")}
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
          <div className='relative'>
            <button
              ref={mobileToggleRef}
              onClick={toggleMobileDropdown}
              className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all focus:outline-none'
              aria-expanded={isMobileDropdownOpen}
              aria-haspopup='true'
            >
              <FaUser size={16} className='text-gray-700' />
            </button>
            {isMobileDropdownOpen && (
              <div
                ref={mobileDropdownRef}
                className='absolute right-0 py-4 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg'
              >
                {isAuthenticated && user?.role === 'park_admin' && (
                  <>
                    <button
                      onClick={() => {
                        navigate("/trip-dashboard");
                        setIsMobileDropdownOpen(false);
                      }}
                      className='block w-full text-start px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                    >
                      Manage Trips
                    </button>
                    <hr className='my-1 border-gray-200' />
                  </>
                )}
                <button
                  onClick={() => {
                    navigate("/modify-bookings");
                    setIsMobileDropdownOpen(false);
                  }}
                  className='block w-full text-start px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                >
                  Change Travel Date
                </button>
                <hr className='my-1 border-gray-200' />
                <button
                  onClick={() => {
                    navigate("/check-ticket");
                    setIsMobileDropdownOpen(false);
                  }}
                  className='block px-4 py-2 w-full text-start text-gray-700 hover:bg-gray-100 transition'
                >
                  Show My Ticket
                </button>
                <hr className='my-1 border-gray-200' />
                <button
                  onClick={() => navigate("/travel-history")}
                  className='block px-4 py-2 w-full text-start text-gray-700 hover:bg-gray-100 transition'
                >
                  Travel History
                </button>
                <hr className='my-1 border-gray-200' />
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className='block px-4 py-2 text-start w-full text-red-600 hover:bg-red-100 transition hover:cursor-pointer'
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/auth")}
                    className='block px-4 py-2 text-start w-full text-gray-700 hover:bg-gray-100 transition'
                  >
                    Sign Up/Log In
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            className='md:hidden text-gray-700 focus:outline-none'
            onClick={() => setIsMenuOpen(true)}
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-64 backdrop-blur-lg bg-black/40 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out p-4`}
      >
        <button
          className='absolute top-4 right-4 text-gray-700 focus:outline-none'
          onClick={() => setIsMenuOpen(false)}
        >
          <FaTimes className='mt-4 text-white' size={24} />
        </button>
        <div className='mt-24 flex flex-col gap-4 space-y-6'>
          <button
            onClick={() => navigate("/#bookhero")}
            className='text-white hover:text-blue-500 flex gap-2 items-center'
          >
            <FaBus className='mr-2' size={18} />
            <span className='font-semibold'>Book Ride</span>
          </button>
          <a
            href='#about'
            className='text-white hover:text-blue-500 flex gap-2 items-center'
          >
            <FaAddressCard className='mr-2' size={18} />
            <span className='font-semibold'>About Us</span>
          </a>
          <button
            onClick={() => navigate("/contact-support")}
            className='text-white hover:text-blue-500 flex gap-2 items-center'
          >
            <FaHeadphones className='mr-2' size={18} />
            <span className='font-semibold'>Contact Support</span>
          </button>
        </div>
      </div>
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          toast.success("Logout successful!", {
            autoClose: 1000,
          });
          setShowLogoutModal(false);
        }}
      />
    </nav>
  );
}