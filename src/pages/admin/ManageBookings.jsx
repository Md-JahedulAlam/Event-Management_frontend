import { useEffect, useState } from "react";
import { fetchAllBookings, updateBookingStatus } from "../../api/bookings";
import StatusBadge from "../../components/StatusBadge";
import Pagination from "../../components/Pagination";

const statusFilters = ["all", "confirmed", "cancelled", "pending"];

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);
    fetchAllBookings({
      status: status === "all" ? undefined : status,
      page,
      page_size: 10,
      ordering: "-created_at",
    })
      .then(({ data }) => {
        setBookings(data.results ?? data);
        setTotalPages(Math.max(1, Math.ceil((data.count ?? 0) / 10)));
      })
      .catch(() => setError("Couldn't load bookings."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status, page]);

  const handleCancel = async (booking) => {
    setUpdatingId(booking.id);
    try {
      await updateBookingStatus(booking.id, { status: "cancelled" });
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: "cancelled" } : b)));
    } catch {
      setError("Couldn't update that booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-marigold-600">Manage</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900">All bookings</h1>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize ${
              status === s ? "bg-ink-900 text-paper" : "bg-white text-ink-600 hover:bg-ink-900/5"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-signal-500">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-ink-600/15 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900/5 text-ink-600">
            <tr>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink-600">
                  Loading…
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink-600">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t border-ink-600/10">
                  <td className="px-4 py-3 font-medium text-ink-900">{b.event_title}</td>
                  <td className="px-4 py-3 text-ink-600">{b.user_email}</td>
                  <td className="px-4 py-3 text-ink-600">{b.quantity}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {b.status?.toLowerCase() === "confirmed" && (
                      <button
                        onClick={() => handleCancel(b)}
                        disabled={updatingId === b.id}
                        className="text-sm font-medium text-signal-500 hover:underline disabled:opacity-50"
                      >
                        {updatingId === b.id ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
