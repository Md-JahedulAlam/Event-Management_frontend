import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-ink-900" : "text-ink-600 hover:text-ink-900"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-600/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-semibold text-ink-900">
          Event<span className="text-marigold-500">Hub</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={linkClass}>
            Browse events
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-bookings" className={linkClass}>
              My bookings
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-ink-600 sm:inline">Hi, {user?.first_name || user?.email}</span>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-700 hover:text-ink-900">
                Log in
              </Link>
              <Button variant="accent" onClick={() => navigate("/register")}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
