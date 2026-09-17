import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://event-management-m58t.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach the JWT access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, clear the stored session and let the app redirect to login.
// Kept deliberately simple (no silent refresh) — swap in a refresh-token
// flow here later if the backend issues one.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
