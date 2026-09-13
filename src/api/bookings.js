import api from "./axios";

// POST /bookings/  -> create a booking { event, quantity }
export const createBooking = (payload) => api.post("/bookings/", payload);

// GET /my-bookings/ -> the logged-in user's own booking history
export const fetchMyBookings = (params) => api.get("/my-bookings/", { params });

// POST /my-bookings/<id>/cancel/ -> cancel one of the user's own bookings
export const cancelBooking = (id) => api.delete(`/my-bookings/${id}/cancel/`);

// NOTE: your urls.py doesn't expose an admin "list/manage all bookings" or
// "update booking status" endpoint yet - ManageBookings.jsx expects
// fetchAllBookings/updateBookingStatus. Add matching views + routes on the
// backend (e.g. an admin-only BookingViewSet or /admin/bookings/) and wire
// them up here once they exist.
export const fetchAllBookings = (params) => api.get("/bookings/", { params });

export const updateBookingStatus = (id, payload) => api.patch(`/bookings/${id}/`, payload);
