import { useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { FaTimes, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { login, signup } from "../api";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

export default function AuthPage({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [signupForm, setSignupForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: loginToContext } = useAuth();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  };

  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setLoginForm({ ...loginForm, [name]: checked });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(loginForm);
      loginToContext(data, true);
      toast.success("Login successful! 🎉", { autoClose: 1000 });
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error("Login failed! " + err.message, { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signup(signupForm);
      loginToContext(data, true);
      onClose();
      toast.success("Signup successful! 🎉", { autoClose: 1500 });
    } catch (err) {
      setError(err.message);
      toast.error("Signup failed! ❌ " + err.message, { autoClose: 1500 });
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
        <div className='w-full md:w-1/2 p-6'>
          <div className='flex justify-end'>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className='flex space-x-6 mb-4'>
            <button
              className={`pb-2 text-lg font-medium ${activeTab === "login" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("login");
                setError("");
                setSignupForm({
                  first_name: "",
                  last_name: "",
                  username: "",
                  email: "",
                  password: "",
                });
                setPasswordVisible(false);
              }}
            >
              Login
            </button>
            <button
              className={`pb-2 text-lg font-medium ${activeTab === "signup" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("signup");
                setError("");
                setLoginForm({
                  email: "",
                  password: "",
                  remember: false,
                });
                setPasswordVisible(false);
              }}
            >
              Signup
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "login" && (
              <form onSubmit={handleLogin}>
                <label className='text-base font-semibold text-gray-700'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder='johndoe@gmail.com'
                  className='w-full border px-3 py-2 mt-1 mb-3 text-sm rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500'
                />
                <label className='text-base font-semibold text-gray-700 mt-8'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name='password'
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder='Enter your Password'
                    className='w-full border px-3 py-2 mt-1 mb-3 text-sm rounded-md focus:outline-none border-gray-200 focus:ring-1 focus:ring-blue-500'
                  />
                  <button
                    type='button'
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className='absolute right-3 top-3 text-gray-500 hover:text-gray-700'
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className='flex justify-between items-center mb-3'>
                  <label className='flex items-center text-sm text-gray-600'>
                    <input
                      type='checkbox'
                      name='remember'
                      checked={loginForm.remember}
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
                    or login with
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
                      value={signupForm.first_name}
                      onChange={handleSignupChange}
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
                      value={signupForm.last_name}
                      onChange={handleSignupChange}
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
                  value={signupForm.username}
                  onChange={handleSignupChange}
                  placeholder='Choose a username'
                  className='w-full border px-3 py-2 mt-1 mb-2 text-sm rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500'
                />

                <label className='text-base font-semibold text-gray-700'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  placeholder='Enter your Email address'
                  className='w-full border px-3 py-2 mt-1 mb-2 text-sm rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500'
                />

                <label className='text-base font-semibold text-gray-700'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name='password'
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    placeholder='Enter your password'
                    className='w-full border px-3 py-2 mt-1 mb-2 text-sm rounded-md focus:outline-none focus:ring-1 border-gray-200 focus:ring-blue-500'
                  />
                  <button
                    type='button'
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className='absolute right-3 top-3 text-gray-500 hover:text-gray-700'
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

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
