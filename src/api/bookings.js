import api from "./axios";

// POST /bookings/ -> create a booking
export const createBooking = (payload) =>
  api.post("/bookings/", payload);


// GET /my-bookings/ -> logged-in user's own booking history
export const fetchMyBookings = (params) =>
  api.get("/my-bookings/", { params });


// DELETE /my-bookings/<id>/cancel/ -> cancel user's booking
export const cancelBooking = (id) =>
  api.delete(`/my-bookings/${id}/cancel/`);


// GET /bookings/ -> all bookings
export const fetchAllBookings = (params) =>
  api.get("/bookings/", { params });


// PATCH /bookings/<id>/status/ -> update booking status
export const updateBookingStatus = (id, payload) =>
  api.patch(`/bookings/${id}/status/`, payload);