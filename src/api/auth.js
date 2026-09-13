import api from "./axios";

export const registerUser = (payload) => api.post("/auth/register/", payload);

export const loginUser = (payload) => api.post("/auth/login/", payload);

// Same endpoint family, but the backend is expected to reject non-admin
// credentials here (or this can point at a dedicated /auth/admin-login/).
export const loginAdmin = (payload) => api.post("/admin/", payload);

export const fetchProfile = () => api.get("/auth/profile/");
