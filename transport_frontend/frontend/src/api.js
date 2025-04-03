import authFetch from "./utils/authFetch";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const login = async ({ email, password }) => {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.detail || "Login failed");

  // Return EXACTLY what AuthContext wants
  return {
    access: data.access,
    refresh: data.refresh,
    user: data.user,
  };
};

export const signup = async (form) => {
  const res = await fetch(`${API_BASE_URL}/auth/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Signup failed");

  return data;
};


export const getBusParks = async () => {
  const res = await authFetch("/parks/");
  if (!res.ok) throw new Error("Failed to load parks");
  return res.json();
};


export default API_BASE_URL;