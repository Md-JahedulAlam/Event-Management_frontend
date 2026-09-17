import { useEffect, useState } from "react";

import { fetchMyBookings, cancelBooking } from "../api/bookings";
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

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === target.id
            ? {
                ...booking,
                status: "cancelled",
                qr_code: null,
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
            className="h-72 rounded-2xl animate-pulse bg-ink-600/10"
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

      {/* Empty */}
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
        <div className="space-y-6">
          {bookings.map((booking) => {
            const isCancelled =
              booking.status?.toLowerCase() === "cancelled";

            const eventTitle =
              booking.event_title ||
              booking.title ||
              booking.event?.title ||
              "Event";

            return (
              <div
                key={booking.id}
                className="relative overflow-hidden bg-white border shadow-sm rounded-3xl border-ink-600/10"
              >
                {/* ============================= */}
                {/* TICKET TOP */}
                {/* ============================= */}

                <div className="relative p-6 sm:p-7">
                  {/* Small Ticket Label */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-marigold-500">
                        Event Ticket
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-ink-900">
                        {eventTitle}
                      </h2>

                      <p className="mt-1 text-sm text-ink-600">
                        Booking ID: #{booking.id}
                      </p>
                    </div>

                    {/* Ticket Icon */}
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-marigold-500/10">
                      <svg
                        className="w-6 h-6 text-marigold-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M3 7.5A2.5 2.5 0 015.5 5H18.5A2.5 2.5 0 0121 7.5V9a2 2 0 010 4v1.5a2.5 2.5 0 01-2.5 2.5H5.5A2.5 2.5 0 013 14.5V13a2 2 0 000-4V7.5Z" />

                        <path
                          d="M9 5v2M9 17v2"
                          strokeLinecap="round"
                        />

                        <path
                          d="M9 9v6"
                          strokeDasharray="1.5 1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Ticket Divider */}
                  <div className="relative my-7">
                    <div className="border-t-2 border-dashed border-ink-600/15" />

                    {/* Left Cut */}
                    <div className="absolute w-7 h-7 rounded-full -left-10 -top-3.5 bg-ink-50" />

                    {/* Right Cut */}
                    <div className="absolute w-7 h-7 rounded-full -right-10 -top-3.5 bg-ink-50" />
                  </div>

                  {/* ============================= */}
                  {/* TICKET CONTENT */}
                  {/* ============================= */}

                  <div className="grid gap-7 lg:grid-cols-[1fr_auto]">
                    {/* Booking Information */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:content-start">
                      <div>
                        <p className="text-xs text-ink-600">
                          Tickets
                        </p>

                        <p className="mt-1 text-lg font-bold text-ink-900">
                          {booking.number_of_tickets}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-ink-600">
                          Booking Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-ink-900">
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

                        <p className="mt-1 text-lg font-bold text-ink-900">
                          ৳{booking.total_price}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-ink-600">
                          Booking ID
                        </p>

                        <p className="mt-1 text-sm font-semibold text-ink-900">
                          #{booking.id}
                        </p>
                      </div>

                      {/* Event Info */}
                      <div className="col-span-2 sm:col-span-4">
                        <div className="p-4 border rounded-xl border-ink-600/10 bg-ink-50">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-ink-600">
                                Event
                              </p>

                              <p className="mt-1 text-sm font-semibold text-ink-900">
                                {eventTitle}
                              </p>
                            </div>

                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-ink-600">
                                Location
                              </p>

                              <p className="mt-1 text-sm font-semibold text-ink-900">
                                {booking.event?.locations ||
                                  booking.locations ||
                                  "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-ink-600">
                                Event Date
                              </p>

                              <p className="mt-1 text-sm font-semibold text-ink-900">
                                {booking.event?.event_date ||
                                  booking.event_date ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ============================= */}
                    {/* QR / LOCKED PASS */}
                    {/* ============================= */}

                    <div className="w-full lg:w-[290px]">
                      <div className="relative overflow-hidden border shadow-sm rounded-2xl border-ink-600/10 bg-ink-50">
                        
                        {/* QR Header */}
                        <div className="px-5 py-4 text-center border-b border-ink-600/10">
                          <p className="text-xs font-bold tracking-[0.2em] uppercase text-ink-900">
                            Digital Pass
                          </p>

                          <p className="mt-1 text-[11px] text-ink-600">
                            Your event access pass
                          </p>
                        </div>

                        {/* QR */}
                        <div className="flex items-center justify-center p-5">
                          {booking.qr_code && !isCancelled ? (
                            <div className="relative p-4 bg-white border shadow-md rounded-xl border-ink-600/10">
                              <img
                                src={booking.qr_code}
                                alt="Booking QR Code"
                                className="block object-contain w-56 h-56"
                              />
                            </div>
                          ) : (
                            <div className="relative flex flex-col items-center justify-center w-64 h-64 overflow-hidden bg-white border-2 border-dashed rounded-xl border-ink-600/20">
                              
                              {/* Locked Background */}
                              <div className="absolute inset-0 opacity-[0.03]">
                                <div className="grid w-full h-full grid-cols-8 grid-rows-8">
                                  {Array.from({ length: 64 }).map(
                                    (_, index) => (
                                      <div
                                        key={index}
                                        className="border border-ink-900"
                                      />
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Lock */}
                              <div className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-sm bg-ink-900/5">
                                <svg
                                  className="w-8 h-8 text-ink-600"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                >
                                  <rect
                                    x="5"
                                    y="10"
                                    width="14"
                                    height="10"
                                    rx="2"
                                  />

                                  <path d="M8 10V7a4 4 0 018 0v3" />

                                  <circle
                                    cx="12"
                                    cy="15"
                                    r="1"
                                    fill="currentColor"
                                    stroke="none"
                                  />

                                  <path d="M12 16v1" />
                                </svg>
                              </div>

                              <p className="relative mt-4 text-sm font-bold text-ink-900">
                                QR Code Locked
                              </p>

                              <p className="relative max-w-[190px] mt-1 text-xs leading-5 text-center text-ink-600">
                                Your digital pass will appear after booking confirmation.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* QR Footer */}
                        <div className="px-5 py-3 text-center bg-white border-t border-ink-600/10">
                          <p className="text-[10px] font-bold tracking-[0.15em] text-ink-600 uppercase">
                            {booking.qr_code && !isCancelled
                              ? "Scan to verify ticket"
                              : "Awaiting confirmation"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ============================= */}
                {/* TICKET BOTTOM */}
                {/* ============================= */}

                <div className="relative px-6 py-5 border-t-2 border-dashed border-ink-600/15 bg-ink-600/5 sm:px-7">
                  
                  {/* Ticket Cut Circles */}
                  <div className="absolute w-7 h-7 rounded-full -left-3.5 -top-3.5 bg-ink-50" />
                  <div className="absolute w-7 h-7 rounded-full -right-3.5 -top-3.5 bg-ink-50" />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {isCancelled ? (
                      <div>
                        <p className="text-sm font-semibold text-signal-500">
                          This ticket has been cancelled.
                        </p>

                        <p className="mt-1 text-xs text-ink-600">
                          This ticket can no longer be used.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-ink-900">
                          Keep this ticket safe.
                        </p>

                        <p className="mt-1 text-xs text-ink-600">
                          Your QR code will be used for event verification.
                        </p>
                      </div>
                    )}

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

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!target}
        title="Cancel this ticket?"
        message={`This will cancel ${
          target?.number_of_tickets ?? ""
        } ticket(s) for "${
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