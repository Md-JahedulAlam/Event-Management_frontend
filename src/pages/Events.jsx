import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useDebounce } from "../hooks/useDebounce";
import { fetchCategories } from "../api/categories";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import Pagination from "../components/Pagination";

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [categories, setCategories] = useState([]);

  const search = useDebounce(searchInput, 400);
  const category = searchParams.get("category") || "";
  const ordering = searchParams.get("ordering") || "event_date";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    fetchCategories().then(({ data }) => setCategories(data.results ?? data)).catch(() => {});
  }, []);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (search) next.set("search", search);
    else next.delete("search");
    next.set("page", "1");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const { events, totalPages, loading, error } = useEvents({ search, category, ordering, page });

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, String(value));
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    setSearchParams(next);
  };

  return (
    
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold tracking-wide uppercase text-marigold-600">EventHub</p>
        <h1 className="text-3xl font-semibold font-display text-ink-900">Find your next night out</h1>
      </div>

      <EventFilters
        search={searchInput}
        onSearch={setSearchInput}
        category={category}
        onCategory={(v) => updateParam("category", v)}
        ordering={ordering}
        onOrdering={(v) => updateParam("ordering", v)}
        categories={categories}
      />

      {error && <p className="text-sm text-signal-500">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-ink-600/10" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="p-10 text-center border border-dashed rounded-2xl border-ink-600/20 text-ink-600">
          No events match that search yet — try a different keyword or category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {events.map((event) => {
    if (event.is_completed) {
      return null;
    }

    return <EventCard key={event.id} event={event} />;
  })}
</div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParam("page", p)} />
    </div>
  );
}
