import { Link } from "react-router-dom";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function EventCard({ event }) {
  const soldOut = event.available_sets <= 0;

  return (
    <Link
      to={`/events/${event.id}`}
      className="flex flex-col overflow-hidden transition-shadow bg-white border shadow-sm group rounded-2xl border-ink-600/15 hover:shadow-md"
    >
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

      <div className="mx-4 border-t border-dashed stub-cut border-ink-600/25" />

      <div className="flex flex-col flex-1 gap-2 p-4">
        <p className="text-xs font-semibold tracking-wide uppercase text-marigold-600">
          {formatDate(event.event_date)}
        </p>
        <h3 className="text-lg font-semibold leading-snug font-display text-ink-900">
          {event.title}
        </h3>
        <p className="text-sm line-clamp-2 text-ink-600">{event.description}</p>
        <div className="flex items-center justify-between pt-2 mt-auto text-sm">
          <span className="font-semibold text-ink-900">
            {event.price ? `৳${event.price}` : "Free"}
          </span>
          <span className={soldOut ? "text-signal-500" : "text-moss-500"}>
            {soldOut ? "Sold out" : `${event.available_sets} seats left`}
          </span>
        </div>
      </div>
    </Link>
  );
}
