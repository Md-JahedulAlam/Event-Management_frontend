import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../../api/events";
import { fetchAllBookings } from "../../api/bookings";
import { fetchCategories } from "../../api/categories";

function StatCard({ label, value, to }) {
  return (
    <Link
      to={to}
      className="flex flex-col gap-1 rounded-2xl border border-ink-600/15 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <span className="text-sm text-ink-600">{label}</span>
      <span className="font-display text-3xl font-semibold text-ink-900">{value}</span>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, categories: 0, bookings: 0, activeBookings: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchEvents({ page_size: 1 }),
      fetchCategories({ page_size: 1 }),
      fetchAllBookings({ page_size: 5, ordering: "-created_at" }),
    ])
      .then(([eventsRes, categoriesRes, bookingsRes]) => {
        const bookings = bookingsRes.data.results ?? bookingsRes.data;
        setStats({
          events: eventsRes.data.count ?? eventsRes.data.length ?? 0,
          categories: categoriesRes.data.count ?? categoriesRes.data.length ?? 0,
          bookings: bookingsRes.data.count ?? bookings.length,
          activeBookings: bookings.filter((b) => b.status?.toLowerCase() === "confirmed").length,
        });
        setRecentBookings(bookings);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-marigold-600">Admin console</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900">Overview</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total events" value={loading ? "—" : stats.events} to="/admin/events" />
        <StatCard label="Categories" value={loading ? "—" : stats.categories} to="/admin/categories" />
        <StatCard label="Total bookings" value={loading ? "—" : stats.bookings} to="/admin/bookings" />
        <StatCard label="Confirmed (recent)" value={loading ? "—" : stats.activeBookings} to="/admin/bookings" />
      </div>

      <div className="rounded-2xl border border-ink-600/15 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink-900">Recent bookings</h2>
        {loading ? (
          <div className="mt-4 flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-ink-600/10" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <p className="mt-3 text-sm text-ink-600">No bookings yet.</p>
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-ink-600">
              <tr>
                <th className="pb-2 font-medium">Event</th>
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Qty</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-t border-ink-600/10">
                  <td className="py-2 text-ink-900">{b.event_title}</td>
                  <td className="py-2 text-ink-600">{b.user_email}</td>
                  <td className="py-2 text-ink-600">{b.quantity}</td>
                  <td className="py-2 capitalize text-ink-600">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
