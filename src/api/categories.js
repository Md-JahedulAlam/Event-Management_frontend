import api from "./axios";

export const fetchCategories = (params) => api.get("/category/", { params });

export const createCategory = (payload) => api.post("/category/", payload);

export const updateCategory = (id, payload) => api.patch(`/category/${id}/`, payload);

export const deleteCategory = (id) => api.delete(`/category/${id}/`);
