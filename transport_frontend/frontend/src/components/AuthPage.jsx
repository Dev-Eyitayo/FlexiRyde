import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaGoogle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { login, signup } from "../api";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

// import API_BASE_URL from "../api";

export default function AuthPage({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const { login: loginToContext } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckBoxChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const data = await login(form); // Get full object: access, refresh, user
      loginToContext(data, true); // true = remember user in localStorage

      console.log("🔑 Auth Success:", data);
      toast.success("Login successful! 🎉"); // Show success toast
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message);
      toast.error("Login failed! ❌ " + err.message); // Show error toast
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading
    try {
      const data = await signup(form);
      loginToContext(data, true); // Automatically login user
      onClose(); // Close modal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className='bg-white w-[900px] m-4 flex rounded-lg shadow-lg overflow-hidden'
      >
        {/* Left Section - Form */}
        <div className='w-full md:w-1/2 p-6'>
          {/* Close Button */}
          <div className='flex justify-end'>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Tabs - Login & Signup */}
          <div className='flex space-x-6 mb-4'>
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

          {/* Animated Login & Signup Forms */}
          <motion.div
            key={activeTab} // Key ensures the animation will trigger on state change
            initial={{ opacity: 0, x: 50 }} // Initial state for the form
            animate={{ opacity: 1, x: 0 }} // Final state for the form
            exit={{ opacity: 0, x: -50 }} // Exit animation
            transition={{ duration: 0.5 }} // Animation duration
          >
            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin}>
                <label className='text-base font-semibold text-gray-700'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder='johndoe@gmail.com'
                  className='w-full border px-3 py-2 mt-1 mb-3 text-sm rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500'
                />
                <label className='text-base font-semibold text-gray-700 mt-8'>
                  Password
                </label>
                <input
                  type='password'
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                  placeholder='Enter your Password'
                  className='w-full border px-3 py-2 mt-1 mb-3 text-sm rounded-md focus:outline-none border-gray-200 focus:ring-1 focus:ring-blue-500'
                />
                <div className='flex justify-between items-center mb-3'>
                  <label className='flex items-center text-sm text-gray-600'>
                    <input
                      type='checkbox'
                      name='remember'
                      checked={form.remember}
                      onChange={handleCheckBoxChange}
                      className='mr-2'
                    />
                    Remember me
                  </label>
                  <span className='text-blue-500 text-sm cursor-pointer'>
                    Forgot Password?{" "}
                    <span className='font-semibold'>Reset</span>
                  </span>
                </div>
                {error && <p className='text-sm text-red-500'>{error}</p>}

                <button
                  type='submit'
                  className='mt-4 w-full font-bold bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center'
                >
                  {loading ? (
                    <FaSpinner className='animate-spin mr-2' />
                  ) : (
                    "Log In"
                  )}
                </button>

                <div className='flex items-center justify-between mt-4'>
                  <hr className='flex-grow border-gray-300' />
                  <p className='w-auto text-center text-gray-500 text-sm'>
                    {" "}
                    or login with{" "}
                  </p>
                  <hr className='flex-grow border-gray-300' />
                </div>

                <button className='mt-4 w-full flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition'>
                  <FaGoogle className='mr-2 text-red-500' />
                  Login with Google
                </button>

                <p className='text-xs text-gray-500 mt-4'>
                  By proceeding, I acknowledge that I have read and agree to the{" "}
                  <span className='text-blue-500 cursor-pointer'>
                    Terms and Conditions
                  </span>
                  .
                </p>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignup}>
                <div className='flex flex-row gap-2 justify-between items-center'>
                  <div>
                    <label className='text-base font-semibold text-gray-700'>
                      First Name
                    </label>
                    <input
                      type='text'
                      name='first_name'
                      value={form.first_name}
                      onChange={handleChange}
                      placeholder='Enter your first name'
                      className='w-full border px-3 py-2 mt-1 mb-2 text-sm rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='text-base font-semibold text-gray-700'>
                      Last Name
                    </label>
                    <input
                      type='text'
                      name='last_name'
                      value={form.last_name}
                      onChange={handleChange}
                      placeholder='Enter your last name'
                      className='w-full border px-3 py-2 mt-1 mb-2 text-sm rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500'
                    />
                  </div>
                </div>

                <label className='text-base font-semibold text-gray-700'>
                  Username
                </label>
                <input
                  type='text'
                  name='username'
                  value={form.username}
                  onChange={handleChange}
                  placeholder='Choose a username'
                  className='w-full border px-3 py-2 mt-1 mb-2 text-sm rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500'
                />

                <label className='text-base font-semibold text-gray-700'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder='Enter your Email address'
                  className='w-full border px-3 py-2 mt-1 mb-2 text-sm rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500'
                />

                <label className='text-base font-semibold text-gray-700'>
                  Password
                </label>
                <input
                  type='password'
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                  className='w-full border px-3 py-2 mt-1 mb-2 text-sm rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500'
                />

                {error && <p className='text-sm text-red-500'>{error}</p>}

                <button
                  type='submit'
                  className='mt-4 w-full font-bold bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center'
                >
                  {loading ? (
                    <FaSpinner className='animate-spin mr-2' />
                  ) : (
                    "Create Account"
                  )}
                </button>
                <div className='flex items-center justify-between mt-4'>
                  <hr className='flex-grow border-gray-300' />
                  <p className='w-auto text-center text-gray-500 text-sm'>
                    or signup with
                  </p>
                  <hr className='flex-grow border-gray-300' />
                </div>

                <button className='mt-4 w-full md:text-base text-sm flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition'>
                  <FaGoogle className='mr-2 text-red-500' />
                  Sign up with Google
                </button>

                <p className='text-xs text-gray-500 mt-4'>
                  By proceeding, I acknowledge that I have read and agree to the{" "}
                  <span className='text-blue-500 cursor-pointer'>
                    Terms and Conditions
                  </span>
                  .
                </p>
              </form>
            )}
          </motion.div>
        </div>

        {/* Right Section - Branding (Only visible on medium and larger screens) */}
        <div className='hidden w-1/2 bg-blue-900 text-white md:flex flex-col items-center justify-center gap-1 p-6'>
          <h2 className='text-2xl self-center font-bold'>
            Welcome to your{" "}
            <span className='text-blue-300'>one-stop travel mate</span>
          </h2>
          <p className='mt-2 text-lg self-start'>Book your ride with ease</p>
        </div>
      </motion.div>
    </div>
  );
}
