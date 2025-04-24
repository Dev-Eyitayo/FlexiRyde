// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authFetch from "../utils/authFetch";

const AuthContext = createContext();
let globalLogout = () => {};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() =>
    JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "null"
    )
  );
  const [access, setAccess] = useState(
    () =>
      localStorage.getItem("access") || sessionStorage.getItem("access") || null
  );
  const [refresh, setRefresh] = useState(
    () =>
      localStorage.getItem("refresh") ||
      sessionStorage.getItem("refresh") ||
      null
  );
  const [lastUserFetch, setLastUserFetch] = useState(null); // Track the last fetch time

  // Auto token refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refresh) return;
      authFetch("/auth/token/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access) {
            setAccess(data.access);
            const storage = localStorage.getItem("access")
              ? localStorage
              : sessionStorage;
            storage.setItem("access", data.access);
          } else {
            console.warn("Token refresh failed. Please log in again.");
          }
        })
        .catch((error) => {
          console.error("Token refresh error:", error);
        });
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [refresh]);

  // Fetch user profile to get managed_parks
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Avoid fetching if we recently fetched (within the last 30 seconds)
      const now = Date.now();
      if (lastUserFetch && now - lastUserFetch < 30 * 1000) {
        console.log("Skipping user profile fetch; recently fetched.");
        return;
      }

      // Only fetch if we have an access token and no user data (or user data is stale)
      if (access && (!user || !user.managed_parks)) {
        try {
          const res = await authFetch("/auth/user/");
          if (res.ok) {
            const userData = await res.json();
            // Only update user if the data has changed to avoid infinite loop
            if (JSON.stringify(userData) !== JSON.stringify(user)) {
              setUser(userData);
              const storage = localStorage.getItem("access")
                ? localStorage
                : sessionStorage;
              storage.setItem("user", JSON.stringify(userData));
            }
            setLastUserFetch(Date.now()); // Update the last fetch time
          } else {
            console.warn("Failed to fetch user profile:", res.statusText);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [access]); // Only depend on access, not user

  const login = async (data, remember = false) => {
    const { access, refresh, user: loginUser } = data;

    setAccess(access);
    setRefresh(refresh);
    setUser(loginUser);

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("access", access);
    storage.setItem("refresh", refresh);
    storage.setItem("user", JSON.stringify(loginUser));

    toast.success(`Welcome, ${loginUser.username || loginUser.email}`);
  };

  const logout = () => {
    setAccess(null);
    setRefresh(null);
    setUser(null);
    setLastUserFetch(null); // Reset the last fetch time
    localStorage.clear();
    sessionStorage.clear();
    toast("You've been logged out.");
    navigate("/");
  };

  globalLogout = logout;

  return (
    <AuthContext.Provider
      value={{
        user,
        access,
        refresh,
        isAuthenticated: !!access,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const getGlobalLogout = () => globalLogout;
