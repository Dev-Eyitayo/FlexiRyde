import { useState, useRef, useEffect, useContext } from "react";
import { FaHeadphones, FaUser, FaBars, FaTimes, FaAddressCard, FaBus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) logout();
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img src={logo} alt="Brand Logo" className="md:h-12 h-10" />
        </div>
        <div className="hidden md:flex gap-4 items-center space-x-6">
          <a href="#bookhero" className="flex items-center text-gray-700 hover:text-red-500">
            <FaBus className="mr-1" size={20} />
            <span className="font-semibold ml-1 text-base">Book Ride</span>
          </a>
          <a href="#about" className="flex items-center text-gray-700 hover:text-red-500">
            <FaAddressCard className="mr-1" size={20} />
            <span className="font-semibold ml-1 text-base">About Us</span>
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-red-500">
            <FaHeadphones className="mr-1" size={20} />
            <span className="font-semibold ml-1 text-base">Contact Support</span>
          </a>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 transition-all focus:outline-none"
            >
              <FaUser size={22} className="text-gray-700" />
              <IoMdArrowDropdown className="ml-1 text-gray-700" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 py-4 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                {isAuthenticated && (
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Hi, {user?.username || user?.email?.split("@")[0]}
                  </div>
                )}
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">Change Travel Date</a>
                <hr className="my-1 border-gray-200" />
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">Show My Ticket</a>
                <hr className="my-1 border-gray-200" />
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">Travel History</a>
                <hr className="my-1 border-gray-200" />
                {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-start w-full text-red-600 hover:bg-red-100 transition"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/auth")}
                      className="block px-4 py-2 text-start w-full text-gray-700 hover:bg-gray-100 transition"
                    >
                      Sign Up/Log In
                    </button>
                )}

                {/* <a onClick={() => openModal} className="block px-4 py-2 text-start w-full text-gray-700 hover:bg-gray-100 transition">Sign Up/Log In</a> */}
              </div>
            )}
          </div>
        </div>


        <div className="md:hidden flex flex-row gap-3">
           <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all focus:outline-none"
              >
                <FaUser size={16} className="text-gray-700" />
                {/* <IoMdArrowDropdown className="ml-1 text-gray-700" /> */}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 py-4 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">Change Travel Date</a>
                  <hr className="my-1 border-gray-200" />
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">Show My Ticket</a>
                  <hr className="my-1 border-gray-200" />
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">Travel History</a>
                  <hr className="my-1 border-gray-200" />
                  <button onClick={() => navigate("/auth")} className="block px-4 py-2 text-start w-full text-gray-700 hover:bg-gray-100 transition">Sign Up/Log In</button>

                  {/* <button onClick={openModal} className="block px-4 py-2 text-start w-full text-gray-700 hover:bg-gray-100 transition">Sign Up/Log In</button> */}
                </div>
              )}
            </div>
            

          <button className="md:hidden text-gray-700 focus:outline-none" onClick={() => setIsMenuOpen(true)}>
            <FaBars size={24} />
          </button>
        </div>
      </div>
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-64 backdrop-blur-lg bg-black/40 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out p-4`}
      >
        <button className="absolute top-4 right-4 text-gray-700 focus:outline-none" onClick={() => setIsMenuOpen(false)}>
          <FaTimes className="mt-4 text-white" size={24} />
        </button>
        <div className="mt-24 flex flex-col gap-4 space-y-6">
          <a href="#bookhero" className="text-white hover:text-blue-500 flex gap-2 items-center">
            <FaBus className="mr-2" size={18} />
            <span className="font-semibold">Book Ride</span>
          </a>
          <a href="#about" className="text-white hover:text-blue-500 flex gap-2 items-center">
            <FaAddressCard className="mr-2" size={18} />
            <span className="font-semibold">About Us</span>
          </a>
          <a href="#" className="text-white hover:text-blue-500 flex gap-2 items-center">
            <FaHeadphones className="mr-2" size={18} />
            <span className="font-semibold">Contact Support</span>
          </a>
        </div>
      </div>
    </nav>
  );
}