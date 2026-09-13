import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Gate a subtree behind authentication and, optionally, a specific role.
 * Usage: <Route element={<ProtectedRoute role="admin" />}>...</Route>
 */
export default function ProtectedRoute({ role }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
