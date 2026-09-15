import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../../api/events";
import { fetchAllBookings } from "../../api/bookings";
import { fetchCategories } from "../../api/categories";

function StatCard({ label, value, to }) {
  return (
    <Link
      to={to}
      className="flex flex-col gap-1 p-6 transition-shadow bg-white border rounded-2xl border-ink-600/15 hover:shadow-md"
    >
      <span className="text-sm text-ink-600">{label}</span>
      <span className="text-3xl font-semibold font-display text-ink-900">
        {value}
      </span>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    categories: 0,
    bookings: 0,
    activeBookings: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchEvents({ page_size: 1 }),
      fetchCategories({ page_size: 1 }),
      fetchAllBookings({
        page_size: 5,
        ordering: "-booking_time",
      }),
    ])
      .then(([eventsRes, categoriesRes, bookingsRes]) => {
        const eventsData = eventsRes.data;
        const categoriesData = categoriesRes.data;
        const bookingsData = bookingsRes.data;

        const bookings = bookingsData.results ?? bookingsData;

        setStats({
          events: eventsData.count ?? eventsData.length ?? 0,

          categories:
            categoriesData.count ?? categoriesData.length ?? 0,

          bookings: bookingsData.count ?? bookings.length,

          // তোমার Booking model-এ status নেই,
          // তাই recent bookings-কে active/recent booking হিসেবে count করছি
          activeBookings: bookings.length,
        });

        setRecentBookings(bookings);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
        setError("Failed to load dashboard data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-wide uppercase text-marigold-600">
          Admin console
        </p>

        <h1 className="text-3xl font-semibold font-display text-ink-900">
          Overview
        </h1>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-signal-500">
          {error}
        </p>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total events"
          value={loading ? "—" : stats.events}
          to="/admin/events"
        />

        <StatCard
          label="Categories"
          value={loading ? "—" : stats.categories}
          to="/admin/categories"
        />

        <StatCard
          label="Total bookings"
          value={loading ? "—" : stats.bookings}
          to="/admin/bookings"
        />

        <StatCard
          label="Recent bookings"
          value={loading ? "—" : stats.activeBookings}
          to="/admin/bookings"
        />
      </div>

      {/* Recent Bookings */}
      <div className="p-6 bg-white border rounded-2xl border-ink-600/15">
        <h2 className="text-lg font-semibold font-display text-ink-900">
          Recent bookings
        </h2>

        {loading ? (
          <div className="flex flex-col gap-2 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-lg animate-pulse bg-ink-600/10"
              />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <p className="mt-3 text-sm text-ink-600">
            No bookings yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full mt-4 text-sm text-left">
              <thead className="text-ink-600">
                <tr>
                  <th className="pb-2 font-medium">
                    Event
                  </th>

                  <th className="pb-2 font-medium">
                    User
                  </th>

                  <th className="pb-2 font-medium">
                    Qty
                  </th>

                  <th className="pb-2 font-medium">
                    Booking Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-t border-ink-600/10"
                  >
                    {/* Event title */}
                    <td className="py-2 text-ink-900">
                      {booking.event?.title || "Unknown event"}
                    </td>

                    {/* User email */}
                    <td className="py-2 text-ink-600">
                      {booking.user?.email || "Unknown user"}
                    </td>

                    {/* Number of tickets */}
                    <td className="py-2 text-ink-600">
                      {booking.number_of_tickets}
                    </td>

                    {/* Booking time */}
                    <td className="py-2 text-ink-600">
                      {booking.booking_time
                        ? new Date(
                            booking.booking_time
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}