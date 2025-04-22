import { getGlobalLogout } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default async function authFetch(url, options = {}) {
  const access =
    localStorage.getItem("access") || sessionStorage.getItem("access");
  const refresh =
    localStorage.getItem("refresh") || sessionStorage.getItem("refresh");
  const logout = getGlobalLogout();

  const headers = {
    "Content-Type": "application/json",
    ...(access && { Authorization: `Bearer ${access}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  let res = await fetch(fullUrl, config);

  // If access token expired, try to refresh it once
  if (res.status === 401 && refresh) {
    const refreshRes = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    const data = await refreshRes.json();

    if (data.access) {
      const storage = localStorage.getItem("access")
        ? localStorage
        : sessionStorage;
      storage.setItem("access", data.access);

      // Retry original request with new token
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${data.access}`,
      };

      res = await fetch(fullUrl, {
        ...options,
        headers: retryHeaders,
      });
    } else {
      logout();
    }
  }

  return res;
}
