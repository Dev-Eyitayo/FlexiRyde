import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginToContext } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const error = query.get("error");

    if (error) {
      toast.error("Google login failed: " + error);
      setLoading(false);
      return;
    }

    if (!code) {
      toast.error("No authorization code found");
      setLoading(false);
      return;
    }

    const exchangeCodeForToken = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/accounts/google-oauth2-callback/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code,
              redirect_uri: window.location.origin + "/google-oauth-callback",
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Google login failed");
        }

        const data = await res.json();
        loginToContext(data, true);
        toast.success("Google login successful! 🎉");
        navigate("/");
      } catch (err) {
        toast.error("Google login failed: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    exchangeCodeForToken();
  }, [location, loginToContext, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
}
