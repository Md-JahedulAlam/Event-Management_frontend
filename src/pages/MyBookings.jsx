import { useEffect, useState } from "react";
import { fetchMyBookings, cancelBooking } from "../api/bookings";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../components/Button";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [target, setTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const loadBookings = () => {
    setLoading(true);
    setError("");

    fetchMyBookings()
      .then(({ data }) => {
        setBookings(data.results ?? data);
      })
      .catch(() => {
        setError("Couldn't load your bookings.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async () => {
    if (!target) return;

    setCancelling(true);
    setError("");

    try {
      await cancelBooking(target.id);

      // Update ticket status without removing it
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === target.id
            ? {
                ...booking,
                status: "cancelled",
              }
            : booking
        )
      );

      setTarget(null);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Couldn't cancel this ticket. Please try again."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="w-48 h-8 rounded-lg animate-pulse bg-ink-600/10" />

        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-2xl bg-ink-600/10"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink-900">
          My Bookings
        </h1>

        <p className="mt-1 text-sm text-ink-600">
          View and manage your event tickets.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 text-sm border rounded-lg border-signal-500/20 bg-signal-500/10 text-signal-500">
          {error}
        </div>
      )}

      {/* No bookings */}
      {bookings.length === 0 ? (
        <div className="p-10 text-center bg-white border rounded-2xl border-ink-600/10">
          <p className="text-lg font-semibold text-ink-900">
            No bookings yet
          </p>

          <p className="mt-1 text-sm text-ink-600">
            Your booked tickets will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const isCancelled =
              booking.status?.toLowerCase() === "cancelled";

            return (
              <div
                key={booking.id}
                className="relative overflow-hidden bg-white border shadow-sm rounded-2xl border-ink-600/10"
              >
                {/* Ticket top */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Event info */}
                    <div>
                      <p className="text-xs font-semibold tracking-wider uppercase text-marigold-500">
                        Event Ticket
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-ink-900">
                        {booking.event_title ||
                          booking.title ||
                          booking.event?.title ||
                          "Event"}
                      </h2>

                      <p className="mt-1 text-sm text-ink-600">
                        Booking ID: #{booking.id}
                      </p>
                    </div>

                    {/* Status */}
                    <StatusBadge
                      status={booking.status || "confirmed"}
                    />
                  </div>

                  {/* Dashed divider */}
                  <div className="relative my-5 border-t border-dashed border-ink-600/20">
                    <div className="absolute w-6 h-6 rounded-full -left-8 -top-3 bg-ink-50" />
                    <div className="absolute w-6 h-6 rounded-full -right-8 -top-3 bg-ink-50" />
                  </div>

                  {/* Booking details */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-ink-600">
                        Tickets
                      </p>

                      <p className="mt-1 font-semibold text-ink-900">
                        {booking.number_of_tickets}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-ink-600">
                        Booking Date
                      </p>

                      <p className="mt-1 font-semibold text-ink-900">
                        {booking.booking_time
                          ? new Date(
                              booking.booking_time
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-ink-600">
                        Total Price
                      </p>

                      <p className="mt-1 font-semibold text-ink-900">
                        ৳{booking.total_price}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-ink-600">
                        Status
                      </p>

                      <p
                        className={`mt-1 font-semibold ${
                          isCancelled
                            ? "text-signal-500"
                            : "text-moss-500"
                        }`}
                      >
                        {isCancelled
                          ? "Cancelled"
                          : "Confirmed"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ticket bottom */}
                <div className="px-5 py-4 border-t border-ink-600/10 bg-ink-600/5 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {isCancelled ? (
                      <p className="text-sm font-medium text-signal-500">
                        This ticket has been cancelled.
                      </p>
                    ) : (
                      <p className="text-sm text-ink-600">
                        You can cancel this ticket if you no longer
                        need it.
                      </p>
                    )}

                    {/* Cancel button */}
                    {!isCancelled && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setTarget(booking)}
                      >
                        Cancel Ticket
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel confirmation */}
      <ConfirmDialog
        open={!!target}
        title="Cancel this ticket?"
        message={`This will cancel ${target?.number_of_tickets ?? ""} ticket(s) for "${
          target?.event_title ||
          target?.title ||
          target?.event?.title ||
          "this event"
        }". The seats will be available again.`}
        confirmLabel="Cancel Ticket"
        onConfirm={handleCancel}
        onCancel={() => setTarget(null)}
        loading={cancelling}
      />
    </div>
  );
}