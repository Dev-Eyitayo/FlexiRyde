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

export default API_BASE_URL;