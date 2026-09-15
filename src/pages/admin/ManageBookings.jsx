import { useEffect, useState } from "react";

import {
  fetchAllBookings,
  updateBookingStatus,
} from "../../api/bookings";

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

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await fetchAllBookings({
        status: status === "all" ? undefined : status,
        page,
        page_size: 10,
        ordering: "-booking_time",
      });

      setBookings(data.results ?? data);

      if (data.count !== undefined) {
        setTotalPages(
          Math.max(1, Math.ceil(data.count / 10))
        );
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error(error);
      setError("Couldn't load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status, page]);

  const handleStatusChange = async (booking, newStatus) => {
    setUpdatingId(booking.id);
    setError("");

    try {
      const { data } = await updateBookingStatus(
        booking.id,
        {
          status: newStatus,
        }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? {
                ...b,
                ...data,
                status: newStatus,
              }
            : b
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "Couldn't update that booking."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirm = (booking) => {
    handleStatusChange(booking, "confirmed");
  };

  const handleCancel = (booking) => {
    handleStatusChange(booking, "cancelled");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Manage Bookings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all event bookings.
          </p>
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-500"
        >
          {statusFilters.map((item) => (
            <option key={item} value={item}>
              {item === "all"
                ? "All"
                : item.charAt(0).toUpperCase() +
                  item.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 mb-4 text-sm text-red-600 rounded-lg bg-red-50">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 font-medium text-gray-600">
                Event
              </th>

              <th className="px-4 py-3 font-medium text-gray-600">
                User
              </th>

              <th className="px-4 py-3 font-medium text-gray-600">
                Tickets
              </th>

              <th className="px-4 py-3 font-medium text-gray-600">
                Total Price
              </th>

              <th className="px-4 py-3 font-medium text-gray-600">
                Status
              </th>

              <th className="px-4 py-3 font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-gray-500"
                >
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-100"
                >
                  {/* Event */}
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-800">
                      {booking.event?.title ||
                        "Unknown Event"}
                    </div>
                  </td>

                  {/* User */}
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-800">
                      {booking.user?.username ||
                        "Unknown User"}
                    </div>

                    <div className="text-xs text-gray-500">
                      {booking.user?.email ||
                        "Unknown Email"}
                    </div>
                  </td>

                  {/* Tickets */}
                  <td className="px-4 py-4 text-gray-700">
                    {booking.number_of_tickets ?? 0}
                  </td>

                  {/* Total Price */}
                  <td className="px-4 py-4 text-gray-700">
                    ৳{booking.total_price ?? "0.00"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge
                      status={booking.status || "pending"}
                    />
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleConfirm(booking)
                            }
                            disabled={
                              updatingId === booking.id
                            }
                            className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingId === booking.id
                              ? "Updating..."
                              : "Confirm"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleCancel(booking)
                            }
                            disabled={
                              updatingId === booking.id
                            }
                            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingId === booking.id
                              ? "Updating..."
                              : "Cancel"}
                          </button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCancel(booking)
                          }
                          disabled={
                            updatingId === booking.id
                          }
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === booking.id
                            ? "Updating..."
                            : "Cancel"}
                        </button>
                      )}

                      {booking.status === "cancelled" && (
                        <span className="text-xs text-gray-400">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading &&
        bookings.length > 0 &&
        totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
    </div>
  );
}