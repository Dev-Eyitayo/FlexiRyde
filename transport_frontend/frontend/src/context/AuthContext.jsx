// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("🔐 TOKEN UPDATED:", token);
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);  

  const login = (accessToken) => {
    try {
      const decoded = jwt_decode(accessToken);
      setUser(decoded); // ✅ Save user info (e.g. email, role, username)
      setToken(accessToken);
    } catch (err) {
      console.error("❌ Failed to decode token", err);
    }
  };  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };
  

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
