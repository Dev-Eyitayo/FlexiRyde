// import { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const AuthContext = createContext();
// let globalLogout = () => {};

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(() =>
//     JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null")
//   );
//   const [access, setAccess] = useState(() =>
//     localStorage.getItem("access") || sessionStorage.getItem("access") || null
//   );
//   const [refresh, setRefresh] = useState(() =>
//     localStorage.getItem("refresh") || sessionStorage.getItem("refresh") || null
//   );

//   // Auto token refresh every 60s
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!refresh) return;
//       fetch(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refresh }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.access) {
//             setAccess(data.access);
//             const storage = localStorage.getItem("access") ? localStorage : sessionStorage;
//             storage.setItem("access", data.access);
//           } else {
//             logout();
//           }
//         })
//         .catch(() => logout());
//     }, 60 * 1000);

//     return () => clearInterval(interval);
//   }, [refresh]);

//   const login = (data, remember = false) => {
//     const { access, refresh, user } = data;

//     setAccess(access);
//     setRefresh(refresh);
//     setUser(user);

//     const storage = remember ? localStorage : sessionStorage;
//     storage.setItem("access", access);
//     storage.setItem("refresh", refresh);
//     storage.setItem("user", JSON.stringify(user));

//     toast.success(`Welcome, ${user.username || user.email}`);
//   };

//   const logout = () => {
//     setAccess(null);
//     setRefresh(null);
//     setUser(null);
//     localStorage.clear();
//     sessionStorage.clear();
//     toast("You've been logged out.");
//     navigate("/");
//   };

//   globalLogout = logout;

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         access,
//         refresh,
//         isAuthenticated: !!access,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// // for use in authFetch
// export const getGlobalLogout = () => globalLogout;

// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authFetch from "../utils/authFetch";  // Import authFetch

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
      authFetch("/auth/token/refresh/", {  // Use authFetch
        method: "POST",
        body: JSON.stringify({ refresh }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access) {
            setAccess(data.access);
            const storage = localStorage.getItem("access") ? localStorage : sessionStorage;
            storage.setItem("access", data.access);
          } else {
            // Don't logout immediately; let the user stay logged in until they try a protected action
            console.warn("Token refresh failed. Please log in again.");
          }
        })
        .catch((error) => {
          console.error("Token refresh error:", error);
          // Don't logout immediately
        });
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [refresh]);

  // Fetch user profile to get managed_parks
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (access && user) {
        try {
          const res = await authFetch("/auth/user/");
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            const storage = localStorage.getItem("access") ? localStorage : sessionStorage;
            storage.setItem("user", JSON.stringify(userData));
          } else {
            console.warn("Failed to fetch user profile:", res.statusText);
            // Don't logout; keep the existing user data
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Don't logout; keep the existing user data
        }
      }
    };
    fetchUserProfile();
  }, [access, user]); // Depend on both access and user to ensure we fetch after login

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