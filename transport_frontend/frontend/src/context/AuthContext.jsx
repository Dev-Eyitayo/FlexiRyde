import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();
let globalLogout = () => {};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null")
  );
  const [access, setAccess] = useState(() =>
    localStorage.getItem("access") || sessionStorage.getItem("access") || null
  );
  const [refresh, setRefresh] = useState(() =>
    localStorage.getItem("refresh") || sessionStorage.getItem("refresh") || null
  );

  // Auto token refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refresh) return;
      fetch(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access) {
            setAccess(data.access);
            const storage = localStorage.getItem("access") ? localStorage : sessionStorage;
            storage.setItem("access", data.access);
          } else {
            logout();
          }
        })
        .catch(() => logout());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [refresh]);

  const login = (data, remember = false) => {
    const { access, refresh, user } = data;

    setAccess(access);
    setRefresh(refresh);
    setUser(user);

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("access", access);
    storage.setItem("refresh", refresh);
    storage.setItem("user", JSON.stringify(user));

    toast.success(`Welcome, ${user.username || user.email}`);
  };

  const logout = () => {
    setAccess(null);
    setRefresh(null);
    setUser(null);
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

// for use in authFetch
export const getGlobalLogout = () => globalLogout;
