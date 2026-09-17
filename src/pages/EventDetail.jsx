import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEvent } from "../api/events";
import { createBooking } from "../api/bookings";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";

const MAX_TICKETS_PER_BOOKING = 6;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchEvent(id)
      .then(({ data }) => setEvent(data))
      .catch(() => setError("Couldn't find that event."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }
    setError("");
    setSuccess("");
    setBooking(true);
    try {
      await createBooking({event: id, number_of_tickets: quantity,});
      setSuccess(`Booked! ${quantity} ticket${quantity > 1 ? "s" : ""} reserved.`);
      setEvent((prev) => ({ ...prev, available_sets: prev.available_sets - quantity }));
    } catch (err) {
      setError(err.response?.data?.detail || "That booking didn't go through. Try a smaller quantity.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-ink-600/10" />;
  if (!event) return <p className="text-signal-500">{error || "Event not found."}</p>;

  const maxSelectable = Math.min(MAX_TICKETS_PER_BOOKING, event.available_sets);
  const soldOut = event.available_sets <= 0;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div>
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
        {event.Image ? (
          <img
            src={event.Image}
            alt={event.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-4xl font-display text-paper/30">
            {event.title?.[0] ?? "?"}
          </div>
        )}
       {event.category?.name && (
  <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-xs font-semibold text-ink-900">
    {event.category.name}
  </span>
)}
      </div>
 

        <h1 className="text-3xl font-semibold font-display text-ink-900">{event.title}</h1>
        <p className="mt-1 text-ink-600"> <span className="text-[rgb(214,135,26)] font-bold">Date: </span>{formatDate(event.event_date)}</p>
        <p className="mt-1 text-ink-600"><span className="text-[rgb(214,135,26)] font-bold">Time: </span> {(event.event_time)}</p>
        <p className="mt-1 text-ink-600"><span className="text-[rgb(214,135,26)] font-bold">Location: </span> {event.locations}</p>

        <p className="mt-4 whitespace-pre-line text-ink-700">{event.description}</p>
      </div>

      <aside className="p-6 bg-white border h-fit rounded-2xl border-ink-600/15">
        <div className="pb-4 border-b border-dashed stub-cut border-ink-600/25">
          <p className="text-2xl font-semibold text-ink-900">{event.price ? `৳${event.price}` : "Free"}</p>
          <p className={`text-sm ${soldOut ? "text-signal-500" : "text-moss-500"}`}>
            {soldOut ? "Sold out" : `${event.available_sets} sets left`}
          </p>
        </div>




<form onSubmit={handleBook} className="flex flex-col gap-4 mt-4">
  {soldOut ? (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink-800">
        Tickets
      </label>

      <p className="rounded-lg border border-signal-500/30 bg-signal-500/10 px-3.5 py-2.5 text-sm font-medium text-signal-500">
        Sold out
      </p>
    </div>
  ) : (
    <>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="quantity"
          className="text-sm font-medium text-ink-800"
        >
          Tickets
        </label>

        <input
          id="quantity"
          type="number"
          min="1"
          max={Math.min(MAX_TICKETS_PER_BOOKING, event.available_sets)}
          value={quantity}
          onChange={(e) => {
            const value = Number(e.target.value);
            setQuantity(
              Math.min(
                Math.max(1, value),
                Math.min(MAX_TICKETS_PER_BOOKING, event.available_sets)
              )
            );
          }}
          placeholder="Enter number of tickets"
          className="rounded-lg border border-ink-600/20 px-3.5 py-2.5 text-sm text-ink-800 focus:border-marigold-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-ink-600/5 px-3.5 py-3">
        <span className="text-sm text-ink-600">
          {event.price ? `৳${event.price} × ${quantity}` : "Free"}
        </span>

        <span className="text-lg font-semibold text-ink-900">
          {event.price
            ? `৳${Number(event.price) * quantity}`
            : "Free"}
        </span>
      </div>
    </>
  )}

  {error && (
    <p className="text-sm text-signal-500">
      {error}
    </p>
  )}

  {success && (
    <p className="text-sm text-moss-500">
      {success}
    </p>
  )}

  <Button
    type="submit"
    variant="accent"
    loading={booking}
    disabled={soldOut}
    className="w-full"
  >
    {soldOut
      ? "Sold out"
      : isAuthenticated
        ? "Book now"
        : "Log in to book"}
  </Button>
</form>





      </aside>
    </div>
  );
}
