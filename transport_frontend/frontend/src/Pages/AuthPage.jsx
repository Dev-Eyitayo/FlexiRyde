import { useState, useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import ModalWrapper from "../components/Authentication/Modalwrapper";
import TabNavigation from "../components/Authentication/TabNavigation";
import LoginForm from "../components/Authentication/LoginForm";
// import SignupForm from "../components/Authentication/SignUpForm";
import SignupForm from "../components/Authentication/SignupForm";
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

    console.log("Google Credential Response:", credentialResponse);

    let idToken = credentialResponse.credential;

    // Fallback: If no credential, try to fetch user info with access token
    if (!idToken && credentialResponse.access_token) {
      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${credentialResponse.access_token}`,
            },
          }
        );
        console.log("Google User Info:", userInfoResponse.data);
        // Note: userinfo doesn't return ID token directly; rely on backend verification
        idToken = credentialResponse.access_token; // Send access_token as fallback
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        const errorMessage = "Unable to validate Google access token.";
        setError(errorMessage);
        toast.error("Login failed! " + errorMessage, { autoClose: 1000 });
        setLoading(false);
        return;
      }
    }

    if (!idToken) {
      const errorMessage = "No ID token received from Google.";
      console.error("Missing ID token in response:", credentialResponse);
      setError(errorMessage);
      toast.error("Login failed! " + errorMessage, { autoClose: 1000 });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google-auth/`,
        {
          access_token: idToken, // Send ID token or access token as fallback
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      loginToContext(response.data, true);
      navigate("/", { replace: true });
      toast.success("Login successful! 🎉", { autoClose: 1000 });
      onClose();
    } catch (err) {
      console.error("Backend Error:", err.response?.data, err.message);
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
