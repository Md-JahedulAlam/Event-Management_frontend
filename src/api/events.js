import api from "./axios";

// params: { search, category, ordering, page, page_size }
export const fetchEvents = (params) => api.get("/event/", { params });

export const fetchEvent = (id) => api.get(`/event/${id}/`);

export const createEvent = (formData) =>
  api.post("/event/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateEvent = (id, formData) =>
  api.patch(`/event/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteEvent = (id) => api.delete(`/event/${id}/`);
