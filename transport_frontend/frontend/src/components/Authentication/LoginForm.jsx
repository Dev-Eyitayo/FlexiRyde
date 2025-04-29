import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { login } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Add import

const LoginForm = ({
  setError,
  getFriendlyErrorMessage,
  onClose,
  resetForm,
  setActiveTab,
}) => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: loginToContext } = useAuth();
  const navigate = useNavigate(); // Add navigate

  useEffect(() => {
    if (resetForm) {
      resetForm(() => {
        setLoginForm({ email: "", password: "", remember: false });
        setPasswordVisible(false);
      });
    }
  }, [resetForm]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!loginForm.email.trim()) {
        throw new Error("Email is required");
      }
      if (!loginForm.password.trim()) {
        throw new Error("Password is required");
      }
      const data = await login(loginForm);
      loginToContext(data, true);
      toast.success("Login successful! 🎉", { autoClose: 1000 });
      setLoginForm({ email: "", password: "", remember: false });
      onClose();
      navigate("/", { replace: true }); // Navigate to home, replace history
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
      toast.error("Login failed! " + friendlyMessage, { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleLogin}>
        <label className='text-base font-semibold text-gray-700'>Email</label>
        <input
          type='email'
          name='email'
          value={loginForm.email}
          onChange={handleLoginChange}
          placeholder='johndoe@gmail.com'
          className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
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
            className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 pr-12'
          />
          <button
            type='button'
            onClick={() => setPasswordVisible(!passwordVisible)}
            className='absolute right-0 top-0 -mt-1 h-full flex items-center justify-center px-4 text-gray-500 hover:text-gray-700'
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className='flex justify-between items-center mb-3'>
          <button
            type='button'
            onClick={() => setActiveTab("reset")}
            className='text-blue-500 text-sm cursor-pointer hover:underline'
          >
            Forgot Password? <span className='font-semibold'>Reset</span>
          </button>
        </div>

        <button
          type='submit'
          className='mt-3 w-full font-bold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center'
          disabled={loading}
        >
          {loading ? <FaSpinner className='animate-spin mr-2' /> : "Log In"}
        </button>

        <p className='text-xs text-gray-500 mt-6'>
          By proceeding, I acknowledge that I have read and agree to the{" "}
          <span className='text-blue-500 cursor-pointer hover:underline'>
            Terms and Conditions
          </span>
          .
        </p>
      </form>
    </motion.div>
  );
};

export default LoginForm;
