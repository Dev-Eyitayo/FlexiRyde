import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { login, signup } from "../api";
import { toast } from "react-toastify";
import googleIcon from "../assets/google-icon.svg";

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
      // Trim email and password before sending
      const trimmedLoginForm = {
        ...loginForm,
        email: loginForm.email.trim(),
        password: loginForm.password.trim(),
      };
      const data = await login(trimmedLoginForm);
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
      if (!signupForm.first_name.trim()) {
        throw new Error("First name is required");
      }
      const signupData = {
        ...signupForm,
        first_name: signupForm.first_name.trim(),
        last_name: signupForm.last_name.trim(),
        email: signupForm.email.trim(),
        password: signupForm.password.trim(),
        username: signupForm.first_name.trim(),
      };
      const data = await signup(signupData);
      loginToContext(data, true);
      onClose();
      toast.success("Signup successful! 🎉", { autoClose: 1500 });
    } catch (err) {
      setError(err.message || "Signup failed. Username may already be taken.");
      toast.error(
        "Signup failed! ❌ " +
          (err.message || "Username may already be taken."),
        { autoClose: 1500 }
      );
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
        className='bg-white w-full max-w-4xl m-4 flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden'
      >
        <div className='w-full md:w-1/2 p-8'>
          <div className='flex justify-end'>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
              aria-label='Close authentication modal'
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className='flex space-x-8 mb-6 border-b border-gray-200'>
            <button
              className={`pb-3 text-xl font-semibold ${
                activeTab === "login"
                  ? "text-blue-600 border-b-4 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => {
                setActiveTab("login");
                setError("");
                setSignupForm({
                  first_name: "",
                  last_name: "",
                  email: "",
                  password: "",
                });
                setPasswordVisible(false);
              }}
            >
              Login
            </button>
            <button
              className={`pb-3 text-xl font-semibold ${
                activeTab === "signup"
                  ? "text-blue-600 border-b-4 border-blue-600"
                  : "text-gray-500"
              }`}
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
              <>
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
                    className='w-full border px-4 py-3 mt-2 mb-4 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
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
                      className='w-full border px-4 py-3 mt-2 mb-4 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
                    />
                    <button
                      type='button'
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className='absolute right-4 -mt-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                      aria-label={
                        passwordVisible ? "Hide password" : "Show password"
                      }
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className='flex justify-between items-center mb-4'>
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
                    <span className='text-blue-500 text-sm cursor-pointer hover:underline'>
                      Forgot Password?{" "}
                      <span className='font-semibold'>Reset</span>
                    </span>
                  </div>
                  {error && (
                    <p className='text-sm text-red-500 mb-2'>{error}</p>
                  )}

                  <button
                    type='submit'
                    className='mt-4 w-full font-bold bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center'
                  >
                    {loading ? (
                      <FaSpinner className='animate-spin mr-2' />
                    ) : (
                      "Log In"
                    )}
                  </button>

                  <p className='text-xs text-gray-500 mt-6'>
                    By proceeding, I acknowledge that I have read and agree to
                    the{" "}
                    <span className='text-blue-500 cursor-pointer hover:underline'>
                      Terms and Conditions
                    </span>
                    .
                  </p>
                </form>

                <div className='mt-6'>
                  <div className='flex items-center justify-between'>
                    <hr className='flex-grow border-gray-300' />
                    <p className='w-auto text-center text-gray-500 text-sm mx-4'>
                      or login with
                    </p>
                    <hr className='flex-grow border-gray-300' />
                  </div>

                  <button className='mt-6 w-full flex items-center justify-center border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition'>
                    <img
                      src={googleIcon}
                      alt='Google icon'
                      className='mr-3 w-6 h-6'
                    />
                    <span className='text-gray-700 font-semibold text-base'>
                      Login with Google
                    </span>
                  </button>
                </div>
              </>
            )}

            {activeTab === "signup" && (
              <>
                <form onSubmit={handleSignup}>
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
                      className='w-full border px-4 py-3 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
                    />
                    <label className='text-base font-semibold text-gray-700'>
                      Last Name
                    </label>
                    <input
                      type='text'
                      name='last_name'
                      value={signupForm.last_name}
                      onChange={handleSignupChange}
                      placeholder='Enter your last name'
                      className='w-full border px-4 py-3 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
                    />
                  </div>

                  <label className='text-base font-semibold text-gray-700'>
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    placeholder='Enter your Email address'
                    className='w-full border px-4 py-3 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
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
                      className='w-full border px-4 py-3 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
                    />
                    <button
                      type='button'
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className='absolute right-4 -mt-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                      aria-label={
                        passwordVisible ? "Hide password" : "Show password"
                      }
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {error && (
                    <p className='text-sm text-red-500 mb-2'>{error}</p>
                  )}

                  <button
                    type='submit'
                    className='mt-4 w-full font-bold bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center'
                  >
                    {loading ? (
                      <FaSpinner className='animate-spin mr-2' />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className='mt-6'>
                  <div className='flex items-center justify-between'>
                    <hr className='flex-grow border-gray-300' />
                    <p className='w-auto text-center text-gray-500 text-sm mx-4'>
                      or signup with
                    </p>
                    <hr className='flex-grow border-gray-300' />
                  </div>

                  <button className='mt-6 w-full md:text-base text-sm flex items-center justify-center border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition'>
                    <img
                      src={googleIcon}
                      alt='Google icon'
                      className='mr-3 w-6 h-6'
                    />
                    <span className='text-gray-700 font-semibold text-base'>
                      Sign up with Google
                    </span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>

        <div className='hidden w-1/2 bg-blue-900 text-white md:flex flex-col items-center justify-center gap-3 p-8'>
          <h2 className='text-3xl self-center font-extrabold leading-tight'>
            Welcome to your{" "}
            <span className='text-blue-300'>one-stop travel mate</span>
          </h2>
          <p className='mt-4 text-xl self-start max-w-xs'>
            Book your ride with ease and enjoy seamless travel experiences.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
