import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";

import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageBookings from "./pages/admin/ManageBookings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin login sits outside both layouts — full-bleed dark screen */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>
          </Route>

          {/* Admin console */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/events" element={<ManageEvents />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
              <Route path="/admin/bookings" element={<ManageBookings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
