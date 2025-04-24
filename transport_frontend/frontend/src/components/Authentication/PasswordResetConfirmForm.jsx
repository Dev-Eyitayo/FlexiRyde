import { useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const PasswordResetConfirmForm = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const getFriendlyErrorMessage = (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;
    let errorMessage =
      errorData?.detail || errorData?.error || error.message || "Unknown error";

    if (errorData?.new_password) {
      const passwordError = Array.isArray(errorData.new_password)
        ? errorData.new_password[0]
        : errorData.new_password;
      return passwordError;
    }

    if (status === 429 || errorMessage.includes("Request was throttled")) {
      return "Too many requests. Please try again later.";
    }
    if (
      errorMessage.includes("Invalid token") ||
      errorMessage.includes("Invalid or expired token")
    ) {
      return "The reset link is invalid or has expired. Please request a new one.";
    }
    if (errorMessage.includes("Passwords do not match")) {
      return "The passwords do not match. Please try again.";
    }
    if (errorMessage.includes("Password is required")) {
      return "Please enter a password.";
    }
    if (error.message.includes("Network Error")) {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    return "An unexpected error occurred. Please try again.";
  };

  const handlePasswordResetConfirm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!newPassword.trim()) {
        throw new Error("Password is required");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/password/reset/confirm/`,
        {
          uid: parseInt(uid),
          token,
          new_password: newPassword,
        }
      );
      console.log("Reset confirm response:", response.data);
      toast.success("Password reset successful! Please log in.", {
        autoClose: 2000,
      });
      setNewPassword("");
      setConfirmPassword("");
      onClose();
      navigate("/auth", { replace: true });
    } catch (err) {
      console.error("Password reset confirm error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
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
      <div className='text-center'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>
          Reset Your Password
        </h3>
        {error && <p className='text-sm text-red-500 mb-2'>{error}</p>}
        <form onSubmit={handlePasswordResetConfirm}>
          <div className='text-left'>
            <label className='text-base font-semibold text-gray-700'>
              New Password
            </label>
            <div className='relative'>
              <input
                type={passwordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='Enter new password'
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

            <label className='text-base font-semibold text-gray-700'>
              Confirm Password
            </label>
            <div className='relative'>
              <input
                type={passwordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm new password'
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
          </div>

          <button
            type='submit'
            className='mt-4 w-full font-bold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center'
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className='animate-spin mr-2' />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default PasswordResetConfirmForm;
