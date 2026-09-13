import { useCallback, useEffect, useState } from "react";
import { fetchEvents } from "../api/events";

const PAGE_SIZE = 9;

export function useEvents({ search, category, ordering, page }) {
  const [events, setEvents] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await fetchEvents({
        search: search || undefined,
        category: category || undefined,
        ordering: ordering || undefined,
        page,
        page_size: PAGE_SIZE,
      });
      setEvents(data.results ?? data);
      setCount(data.count ?? data.length ?? 0);
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't load events right now.");
    } finally {
      setLoading(false);
    }
  }, [search, category, ordering, page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return { events, count, totalPages, loading, error, reload: load };
}
