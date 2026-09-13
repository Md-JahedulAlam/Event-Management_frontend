import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/bookings", label: "Bookings" },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="flex h-screen w-60 flex-col justify-between border-r border-paper/10 bg-ink-950 px-5 py-6 text-paper">
      <div>
        <p className="font-display text-lg font-semibold">
          Event<span className="text-marigold-500">Hub</span>
        </p>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-paper/40">Admin console</p>

        <nav className="mt-8 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-marigold-500 text-ink-950" : "text-paper/70 hover:bg-paper/10 hover:text-paper"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-paper/10 pt-4 text-sm">
        <p className="truncate text-paper/60">{user?.email}</p>
        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          className="mt-2 text-sm font-medium text-signal-500 hover:underline"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
