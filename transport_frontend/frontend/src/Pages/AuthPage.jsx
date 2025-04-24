// import { useState } from "react";
// import { motion } from "framer-motion";
// import { FaTimes, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";
// import { login, signup } from "../api";
// import { toast } from "react-toastify";
// import googleIcon from "../assets/google-icon.svg";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import.meta.env;
// import axios from "axios";

// export default function AuthPage({ isOpen, onClose }) {
//   const [activeTab, setActiveTab] = useState("login");
//   const [loginForm, setLoginForm] = useState({
//     email: "",
//     password: "",
//     remember: false,
//   });
//   const [signupForm, setSignupForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//   });
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { login: loginToContext } = useAuth();

//   // Function to map backend errors to user-friendly messages
//   const getFriendlyErrorMessage = (error) => {
//     const errorMessage =
//       error.response?.data?.error || error.message || "Unknown error";
//     console.error("Technical error:", errorMessage, error); // Log technical details

//     // Map common backend errors to friendly messages
//     if (
//       errorMessage.includes("UNIQUE constraint failed: accounts_user.email")
//     ) {
//       return "This email is already registered. Please use a different email.";
//     }
//     if (errorMessage.includes("UNIQUE constraint failed: accounts_user.nin")) {
//       return "This NIN is already in use. Please contact support.";
//     }
//     if (errorMessage.includes("A user with that email already exists")) {
//       return "This email is already registered. Please log in or use a different email.";
//     }
//     if (errorMessage.includes("First name is required")) {
//       return "Please enter your first name.";
//     }
//     if (errorMessage.includes("Email is required")) {
//       return "Please enter your email address.";
//     }
//     if (errorMessage.includes("Password is required")) {
//       return "Please enter a password.";
//     }
//     if (errorMessage.includes("Invalid email")) {
//       return "Please enter a valid email address.";
//     }
//     if (errorMessage.includes("Cannot login with provided credentials")) {
//       return "Incorrect email or password. Please try again.";
//     }
//     if (errorMessage.includes("No active account found")) {
//       return "Invalid Login credentials";
//     }
//     if (errorMessage.includes("Invalid Google token")) {
//       return "Google authentication failed. Please try again.";
//     }
//     if (errorMessage.includes("Access token is required")) {
//       return "Google authentication failed. Missing access token.";
//     }

//     // Fallback for unknown errors
//     return "Something went wrong. Please try again.";
//   };

//   const handleLoginChange = (e) => {
//     const { name, value } = e.target;
//     setLoginForm({ ...loginForm, [name]: value });
//   };

//   const handleSignupChange = (e) => {
//     const { name, value } = e.target;
//     setSignupForm({ ...signupForm, [name]: value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       if (!loginForm.email.trim()) {
//         throw new Error("Email is required");
//       }
//       if (!loginForm.password.trim()) {
//         throw new Error("Password is required");
//       }
//       const data = await login(loginForm);
//       loginToContext(data, true);
//       toast.success("Login successful! 🎉", { autoClose: 1000 });
//       onClose();
//     } catch (err) {
//       const friendlyMessage = getFriendlyErrorMessage(err);
//       setError(friendlyMessage);
//       toast.error("Login failed! " + friendlyMessage, { autoClose: 1000 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       if (!signupForm.first_name.trim()) {
//         throw new Error("First name is required");
//       }
//       if (!signupForm.email.trim()) {
//         throw new Error("Email is required");
//       }
//       if (!signupForm.password.trim()) {
//         throw new Error("Password is required");
//       }
//       const signupData = {
//         first_name: signupForm.first_name.trim(),
//         last_name: signupForm.last_name.trim(),
//         email: signupForm.email.trim(),
//         password: signupForm.password,
//       };
//       console.log("Signup payload:", signupData); // Debug payload
//       const data = await signup(signupData);
//       loginToContext(data, true);
//       onClose();
//       toast.success("Signup successful! 🎉", { autoClose: 1000 });
//     } catch (err) {
//       const friendlyMessage = getFriendlyErrorMessage(err);
//       setError(friendlyMessage);
//       toast.error("Signup failed! " + friendlyMessage, { autoClose: 1500 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     setError("");
//     setLoading(true);

//     console.log("Google Credential:", credentialResponse.credential); // Debug

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/auth/google-auth/`,
//         {
//           access_token: credentialResponse.credential,
//         }
//       );

//       loginToContext(response.data, true);
//       toast.success("Login successful! 🎉", { autoClose: 1000 });
//       onClose();
//     } catch (err) {
//       const friendlyMessage = getFriendlyErrorMessage(err);
//       setError(friendlyMessage);
//       toast.error("Login failed! " + friendlyMessage, {
//         autoClose: 1000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleError = () => {
//     const friendlyMessage = "Google authentication failed. Please try again.";
//     setError(friendlyMessage);
//     toast.error("Login failed! " + friendlyMessage, { autoClose: 1000 });
//   };

//   if (!isOpen) return null;

//   return (
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//       {console.log(import.meta.env.GOOGLE_OAUTH_CLIENT_ID)}
//       <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'>
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -50 }}
//           transition={{ duration: 0.3 }}
//           className='bg-white w-full max-w-4xl m-4 flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden'
//         >
//           <div className='w-full md:w-1/2 p-8'>
//             <div className='flex justify-end'>
//               <button
//                 onClick={onClose}
//                 className='text-gray-500 hover:text-gray-700'
//                 aria-label='Close authentication modal'
//               >
//                 <FaTimes size={24} />
//               </button>
//             </div>

//             <div className='flex space-x-8 mb-6'>
//               <button
//                 className={`pb-2 text-xl font-semibold ${
//                   activeTab === "login"
//                     ? "text-blue-600 border-b-3 border-blue-600"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => {
//                   setActiveTab("login");
//                   setError("");
//                   setSignupForm({
//                     first_name: "",
//                     last_name: "",
//                     email: "",
//                     password: "",
//                   });
//                   setPasswordVisible(false);
//                 }}
//               >
//                 Login
//               </button>
//               <button
//                 className={`pb-2 text-xl font-semibold ${
//                   activeTab === "signup"
//                     ? "text-blue-600 border-b-3 border-blue-600"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => {
//                   setActiveTab("signup");
//                   setError("");
//                   setLoginForm({
//                     email: "",
//                     password: "",
//                     remember: false,
//                   });
//                   setPasswordVisible(false);
//                 }}
//               >
//                 Signup
//               </button>
//             </div>

//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -50 }}
//               transition={{ duration: 0.5 }}
//             >
//               {activeTab === "login" && (
//                 <>
//                   <form onSubmit={handleLogin}>
//                     <label className='text-base font-semibold text-gray-700'>
//                       Email
//                     </label>
//                     <input
//                       type='email'
//                       name='email'
//                       value={loginForm.email}
//                       onChange={handleLoginChange}
//                       placeholder='johndoe@gmail.com'
//                       className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
//                     />
//                     <label className='text-base font-semibold text-gray-700 mt-8'>
//                       Password
//                     </label>
//                     <div className='relative'>
//                       <input
//                         type={passwordVisible ? "text" : "password"}
//                         name='password'
//                         value={loginForm.password}
//                         onChange={handleLoginChange}
//                         placeholder='Enter your Password'
//                         className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 pr-12'
//                       />
//                       <button
//                         type='button'
//                         onClick={() => setPasswordVisible(!passwordVisible)}
//                         className='absolute right-0 top-0 -mt-1 h-full flex items-center justify-center px-4 text-gray-500 hover:text-gray-700'
//                         aria-label={
//                           passwordVisible ? "Hide password" : "Show password"
//                         }
//                       >
//                         {passwordVisible ? <FaEyeSlash /> : <FaEye />}
//                       </button>
//                     </div>
//                     <div className='flex justify-between items-center mb-3'>
//                       <span className='text-blue-500 text-sm cursor-pointer hover:underline'>
//                         Forgot Password?{" "}
//                         <span className='font-semibold'>Reset</span>
//                       </span>
//                     </div>
//                     {error && (
//                       <p className='text-sm text-red-500 mb-2'>{error}</p>
//                     )}

//                     <button
//                       type='submit'
//                       className='mt-3 w-full font-bold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center'
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <FaSpinner className='animate-spin mr-2' />
//                       ) : (
//                         "Log In"
//                       )}
//                     </button>

//                     <p className='text-xs text-gray-500 mt-6'>
//                       By proceeding, I acknowledge that I have read and agree to
//                       the{" "}
//                       <span className='text-blue-500 cursor-pointer hover:underline'>
//                         Terms and Conditions
//                       </span>
//                       .
//                     </p>
//                   </form>

//                   <div className='mt-4'>
//                     <div className='flex items-center justify-between mb-3 '>
//                       <hr className='flex-grow border-gray-300' />
//                       <p className='w-auto text-center text-gray-500 text-sm mx-4'>
//                         or login with
//                       </p>
//                       <hr className='flex-grow border-gray-300' />
//                     </div>

//                     <GoogleLogin
//                       onSuccess={handleGoogleSuccess}
//                       onError={handleGoogleError}
//                       // useOneTap
//                       render={(renderProps) => (
//                         <button
//                           onClick={renderProps.onClick}
//                           disabled={renderProps.disabled || loading}
//                           className='mt-4 w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition'
//                         >
//                           <img
//                             src={googleIcon}
//                             alt='Google icon'
//                             className='mr-3 w-6 h-6'
//                           />
//                           <span className='text-gray-900 font-bold text-base'>
//                             Login with Google
//                           </span>
//                         </button>
//                       )}
//                     />
//                   </div>
//                 </>
//               )}

//               {activeTab === "signup" && (
//                 <>
//                   <form onSubmit={handleSignup}>
//                     <div>
//                       <label className='text-base font-semibold text-gray-700'>
//                         First Name
//                       </label>
//                       <input
//                         type='text'
//                         name='first_name'
//                         value={signupForm.first_name}
//                         onChange={handleSignupChange}
//                         placeholder='Enter your first name'
//                         className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
//                       />
//                       <label className='text-base font-semibold text-gray-700'>
//                         Last Name
//                       </label>
//                       <input
//                         type='text'
//                         name='last_name'
//                         value={signupForm.last_name}
//                         onChange={handleSignupChange}
//                         placeholder='Enter your last name'
//                         className='w-full border px-4 py-3 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
//                       />
//                     </div>

//                     <label className='text-base font-semibold text-gray-700'>
//                       Email
//                     </label>
//                     <input
//                       type='email'
//                       name='email'
//                       value={signupForm.email}
//                       onChange={handleSignupChange}
//                       placeholder='Enter your Email address'
//                       className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300'
//                     />

//                     <label className='text-base font-semibold text-gray-700'>
//                       Password
//                     </label>
//                     <div className='relative'>
//                       <input
//                         type={passwordVisible ? "text" : "password"}
//                         name='password'
//                         value={signupForm.password}
//                         onChange={handleSignupChange}
//                         placeholder='Enter your password'
//                         className='w-full border px-4 py-2 mt-2 mb-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 pr-12'
//                       />
//                       <button
//                         type='button'
//                         onClick={() => setPasswordVisible(!passwordVisible)}
//                         className='absolute right-0 -mt-1 top-0 h-full flex items-center justify-center px-4 text-gray-500 hover:text-gray-700'
//                         aria-label={
//                           passwordVisible ? "Hide password" : "Show password"
//                         }
//                       >
//                         {passwordVisible ? <FaEyeSlash /> : <FaEye />}
//                       </button>
//                     </div>

//                     {error && (
//                       <p className='text-sm text-red-500 mb-2'>{error}</p>
//                     )}

//                     <button
//                       type='submit'
//                       className='mt-4 w-full font-bold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center'
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <FaSpinner className='animate-spin mr-2' />
//                       ) : (
//                         "Create Account"
//                       )}
//                     </button>
//                   </form>

//                   <div className='mt-4'>
//                     <div className='flex items-center justify-between mb-3'>
//                       <hr className='flex-grow border-gray-300' />
//                       <p className='w-auto text-center text-gray-500 text-sm mx-4'>
//                         or signup with
//                       </p>
//                       <hr className='flex-grow border-gray-300' />
//                     </div>
//                     {/* <div className='mt-3'></div> */}
//                     <GoogleLogin
//                       onSuccess={handleGoogleSuccess}
//                       onError={handleGoogleError}
//                       // useOneTap
//                       // render={(renderProps) => (
//                       //   <button
//                       //     onClick={renderProps.onClick}
//                       //     disabled={renderProps.disabled || loading}
//                       //     className='mt-4 w-full md:text-base text-sm flex items-center justify-center border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition'
//                       //   >
//                       //     <img
//                       //       src={googleIcon}
//                       //       alt='Google icon'
//                       //       className='mr-3 w-6 h-6'
//                       //     />
//                       //     <span className='text-gray-700 font-semibold text-base'>
//                       //       Sign up with Google
//                       //     </span>
//                       //   </button>
//                       // )}
//                     />
//                   </div>
//                 </>
//               )}
//             </motion.div>
//           </div>

//           <div className='hidden w-1/2 bg-blue-900 text-white md:flex flex-col items-center justify-center gap-3 p-8'>
//             <h2 className='text-3xl self-center font-extrabold leading-tight'>
//               Welcome to your{" "}
//               <span className='text-blue-300'>one-stop travel mate</span>
//             </h2>
//             <p className='mt-3 text-xl self-start max-w-xs'>
//               Book your ride with ease and enjoy seamless travel experiences.
//             </p>
//           </div>
//         </motion.div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }
import { useState, useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import ModalWrapper from "../components/Authentication/Modalwrapper";
import TabNavigation from "../components/Authentication/TabNavigation";
import LoginForm from "../components/Authentication/LoginForm";
import SignupForm from "../components/Authentication/SignUpForm";
import GoogleAuthButton from "../components/Authentication/GoogleAuthButton";
import PasswordResetForm from "../components/Authentication/PasswordResetForm"; // New import
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: loginToContext } = useAuth();
  const loginFormResetRef = useRef(null);
  const signupFormResetRef = useRef(null);
  const navigate = useNavigate();

  // Function to map backend errors to user-friendly messages
  const getFriendlyErrorMessage = (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;
    let errorMessage =
      errorData?.detail || errorData?.error || error.message || "Unknown error";

    // Handle serializer errors (e.g., {'email': ['No user found with this email.']})
    if (errorData?.email) {
      const emailError = Array.isArray(errorData.email)
        ? errorData.email[0]
        : errorData.email;
      if (emailError.includes("No user found with this email")) {
        return "No account found with this email. Please check and try again.";
      }
      if (emailError.includes("Enter a valid email address")) {
        return "Please enter a valid email address.";
      }
      return emailError; // Fallback for other email errors
    }

    console.error("Technical error:", {
      status,
      errorMessage,
      errorData,
      error,
    });

    // Throttling error (HTTP 429)
    if (status === 429 || errorMessage.includes("Request was throttled")) {
      return "Too many requests. Please try again later.";
    }

    // Password reset errors
    if (errorMessage.includes("Multiple users found with this email")) {
      return "Multiple accounts found with this email. Please contact support.";
    }
    if (errorMessage.includes("Failed to render email template")) {
      return "Unable to process your request. Please try again later.";
    }
    if (errorMessage.includes("Failed to send email")) {
      return "Failed to send reset email. Please try again later.";
    }
    if (errorMessage.includes("Invalid or expired token")) {
      return "The reset link is invalid or has expired. Please request a new one.";
    }

    // Signup and login errors
    if (
      errorMessage.includes("UNIQUE constraint failed: accounts_user.email")
    ) {
      return "This email is already registered. Please use a different email.";
    }
    if (errorMessage.includes("UNIQUE constraint failed: accounts_user.nin")) {
      return "This NIN is already in use. Please contact support.";
    }
    if (errorMessage.includes("A user with that email already exists")) {
      return "This email is already registered. Please log in or use a different email.";
    }
    if (errorMessage.includes("First name is required")) {
      return "Please enter your first name.";
    }
    if (errorMessage.includes("Email is required")) {
      return "Please enter your email address.";
    }
    if (errorMessage.includes("Password is required")) {
      return "Please enter a password.";
    }
    if (errorMessage.includes("Invalid email")) {
      return "Please enter a valid email address.";
    }
    if (errorMessage.includes("Cannot login with provided credentials")) {
      return "Incorrect email or password. Please try again.";
    }
    if (errorMessage.includes("No active account found")) {
      return "Invalid login credentials.";
    }
    if (errorMessage.includes("Invalid Google token")) {
      return "Google authentication failed. Please try again.";
    }
    if (errorMessage.includes("Access token is required")) {
      return "Google authentication failed. Missing access token.";
    }

    // Network or unexpected errors
    if (error.message.includes("Network Error")) {
      return "Unable to connect to the server. Please check your internet connection.";
    }

    // Fallback for unknown errors
    return "An unexpected error occurred. Please try again.";
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google-auth/`,
        {
          access_token: credentialResponse.credential,
        }
      );
      loginToContext(response.data, true);
      navigate("/", { replace: true }); // Navigate to home, replace history
      toast.success("Login successful! 🎉", { autoClose: 1000 });
      onClose();
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
      toast.error("Login failed! " + friendlyMessage, { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    const friendlyMessage = "Google authentication failed. Please try again.";
    setError(friendlyMessage);
    toast.error("Login failed! " + friendlyMessage, { autoClose: 1000 });
  };

  const resetForms = (tab) => {
    if (tab === "login" && signupFormResetRef.current) {
      signupFormResetRef.current();
    } else if (tab === "signup" && loginFormResetRef.current) {
      loginFormResetRef.current();
    } else if (tab === "reset") {
      // Reset both forms when switching to password reset
      if (loginFormResetRef.current) loginFormResetRef.current();
      if (signupFormResetRef.current) signupFormResetRef.current();
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ModalWrapper isOpen={isOpen} onClose={onClose}>
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setError={setError}
          resetForms={resetForms}
        />
        {error && <p className='text-sm text-red-500 mb-2'>{error}</p>}
        {activeTab === "login" ? (
          <>
            <LoginForm
              setError={setError}
              getFriendlyErrorMessage={getFriendlyErrorMessage}
              onClose={onClose}
              resetForm={(resetFn) => (loginFormResetRef.current = resetFn)}
              setActiveTab={setActiveTab} // Pass setActiveTab for password reset
            />
            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              loading={loading}
              action='Login'
            />
          </>
        ) : activeTab === "signup" ? (
          <>
            <SignupForm
              setError={setError}
              getFriendlyErrorMessage={getFriendlyErrorMessage}
              onClose={onClose}
              resetForm={(resetFn) => (signupFormResetRef.current = resetFn)}
            />
            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              loading={loading}
              action='Signup'
            />
          </>
        ) : (
          <PasswordResetForm
            setError={setError}
            getFriendlyErrorMessage={getFriendlyErrorMessage}
            onClose={onClose}
          />
        )}
      </ModalWrapper>
    </GoogleOAuthProvider>
  );
}
