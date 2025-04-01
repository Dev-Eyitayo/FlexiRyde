import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaGoogle } from "react-icons/fa";

export default function AuthPage({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-[700px] m-2 flex rounded-lg shadow-lg overflow-hidden"
      >
        {/* Left Section - Form */}
        <div className="w-1/2 p-6">
          {/* Close Button */}
          <div className="flex justify-end">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={20} />
            </button>
          </div>

          {/* Tabs - Login & Signup */}
          <div className="flex space-x-6 mb-4">
            <button
              className={`pb-2 text-lg font-medium ${activeTab === "login" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-500"}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`pb-2 text-lg font-medium ${activeTab === "signup" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("signup")}
            >
              Signup
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form>
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full border px-3 py-2 mt-1 mb-3 text-base rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700 mt-8">Password</label>
              <input
                type="password"
                placeholder="Enter your Password"
                className="w-full border px-3 py-2 mt-1 mb-3 text-base rounded-md focus:outline-none border-gray-200 focus:ring-1 focus:ring-blue-500"
              />
             

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md  hover:bg-blue-700 transition">
                Log In
              </button>

              <div className="flex items-center justify-between mt-4">
                <hr className="w-full border-gray-300"/>
                <p className="w-full text-center text-gray-500 text-sm">or login with</p>
                <hr className="w-full border-gray-300" />
              </div>

              {/* <button className="mt-4 w-full border py-2 rounded-md hover:bg-gray-100 transition">
                Login with Password
              </button> */}

              <button className="mt-4 w-full flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition">
                <FaGoogle className="mr-2 text-red-500" />
                Login with Google
              </button>

              <p className="text-xs text-gray-500 mt-4">
                By proceeding, I acknowledge that I have read and agree to the{" "}
                <span className="text-blue-500 cursor-pointer">Terms and Conditions</span>.
              </p>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form>
              <label className="text-sm text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border px-3 py-2 mt-1 mb-3 text-base rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500"
              />

              <label className="text-sm text-gray-700 mt-2 block">Email</label>
              <input
                type="email"
                placeholder="Enter your Email address"
                className="w-full border px-3 py-2 mt-1 mb-2 text-base rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500"
              />

              <label className="text-sm text-gray-700 mt-2 block">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border px-3 py-2 mt-1 mb-2 rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500"
              />

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                Create Account
              </button>

              <div className="flex items-center justify-between mt-4">
                <hr className="w-full border-gray-300" />
                <span className="w-full text-center text-gray-500 text-sm">or sign up with</span>
                <hr className="w-full border-gray-300" />
              </div>



              <button className="mt-4 w-full md:text-base text-sm flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition">
                <FaGoogle className="mr-2 text-red-500" />
                Sign up with Google
              </button>

              <p className="text-xs text-gray-500 mt-4">
                By proceeding, I acknowledge that I have read and agree to the{" "}
                <span className="text-blue-500 cursor-pointer">Terms and Conditions</span>.
              </p>
            </form>
          )}
        </div>

        {/* Right Section - Branding */}
        <div className="w-1/2 bg-blue-900 text-white flex flex-col gap-1 items-center justify-center p-6">
          <h2 className="text-2xl font-bold">
            Welcome to your <span className="text-blue-300">one-stop travel mate</span>
          </h2>
          <p className="mt-2 text-lg self-start">Book your ride with ease</p>
        </div>
      </motion.div>
    </div>
  );
}
