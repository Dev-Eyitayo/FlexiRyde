// src/components/Authentication/PasswordResetForm.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const PasswordResetForm = ({ setError, getFriendlyErrorMessage, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email.trim()) {
        throw new Error("Email is required");
      }
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/password/reset/`, {
        email: email.trim(),
      });
      setResetSent(true);
      toast.success("Password reset link sent! Check your email.", {
        autoClose: 2000,
      });
      setEmail(""); // Reset email input
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
      toast.error("Password reset failed! " + friendlyMessage, {
        autoClose: 1500,
      });
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
      {resetSent ? (
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Check Your Email
          </h3>
          <p className='text-sm text-gray-500 mb-4'>
            A password reset link has been sent to <strong>{email}</strong>.
            Please check your inbox (and spam/junk folder) to reset your
            password.
          </p>
          <button
            onClick={onClose}
            className='mt-4 w-full font-bold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <label className='text-base font-semibold text-gray-700'>Email</label>
          <input
            type='email'
            value={email}
            onChange={handleEmailChange}
            placeholder='Enter your email address'
            className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
          />
          <button
            type='submit'
            className='mt-4 w-full font-bold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center'
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className='animate-spin mr-2' />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default PasswordResetForm;
