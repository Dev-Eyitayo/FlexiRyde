import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { signup } from "../../api";
import { useAuth } from "../../context/AuthContext";

const SignupForm = ({
  setError,
  getFriendlyErrorMessage,
  onClose,
  resetForm,
}) => {
  const [signupForm, setSignupForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: loginToContext } = useAuth();

  // Expose reset functionality via the resetForm prop
  useEffect(() => {
    if (resetForm) {
      resetForm(() => {
        setSignupForm({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        });
        setPasswordVisible(false);
      });
    }
  }, [resetForm]);

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!signupForm.first_name.trim()) {
        throw new Error("First name is required");
      }
      if (!signupForm.email.trim()) {
        throw new Error("Email is required");
      }
      if (!signupForm.password.trim()) {
        throw new Error("Password is required");
      }
      const signupData = {
        first_name: signupForm.first_name.trim(),
        last_name: signupForm.last_name.trim(),
        email: signupForm.email.trim(),
        password: signupForm.password,
      };
      const data = await signup(signupData);
      loginToContext(data, true);
      toast.success("Signup successful! 🎉", { autoClose: 1000 });
      // Reset form on success
      setSignupForm({ first_name: "", last_name: "", email: "", password: "" });
      onClose();
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
      toast.error("Signup failed! " + friendlyMessage, { autoClose: 1500 });
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
            className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
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
            className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
          />
        </div>

        <label className='text-base font-semibold text-gray-700'>Email</label>
        <input
          type='email'
          name='email'
          value={signupForm.email}
          onChange={handleSignupChange}
          placeholder='Enter your Email address'
          className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
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
            className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 pr-12'
          />
          <button
            type='button'
            onClick={() => setPasswordVisible(!passwordVisible)}
            className='absolute right-0 -mt-1 top-0 h-full flex items-center justify-center px-4 text-gray-500 hover:text-gray-700'
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type='submit'
          className='mt-4 w-full font-bold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center'
          disabled={loading}
        >
          {loading ? (
            <FaSpinner className='animate-spin mr-2' />
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default SignupForm;
