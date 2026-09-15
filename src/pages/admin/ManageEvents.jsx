import { useEffect, useState } from "react";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../../api/events";
import { fetchCategories } from "../../api/categories";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import Pagination from "../../components/Pagination";
import EventForm from "./EventForm";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetchEvents({ page, page_size: 8, ordering: "-date" })
      .then(({ data }) => {
        setEvents(data.results ?? data);
        setTotalPages(Math.max(1, Math.ceil((data.count ?? 0) / 8)));
      })
      .catch(() => setError("Couldn't load events."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);
  useEffect(() => {
    fetchCategories().then(({ data }) => setCategories(data.results ?? data)).catch(() => {});
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing?.id) {
        await updateEvent(editing.id, formData);
      } else {
        await createEvent(formData);
      }
      setEditing(null);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteEvent(deleting.id);
      setDeleting(null);
      load();
    } catch {
      setError("Couldn't delete that event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-marigold-600">Manage</p>
          <h1 className="text-3xl font-semibold font-display text-ink-900">Events</h1>
        </div>
        <Button variant="accent" onClick={() => setEditing({})}>
          New event
        </Button>
      </div>

      {error && <p className="text-sm text-signal-500">{error}</p>}

      <div className="overflow-hidden bg-white border rounded-2xl border-ink-600/15">
        <table className="w-full text-sm text-left">
          <thead className="bg-ink-900/5 text-ink-600">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Seats left</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink-600">
                  Loading…
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink-600">
                  No events yet — create your first one.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="border-t border-ink-600/10">
                  <td className="px-4 py-3 font-medium text-ink-900">{event.title}</td>
                  <td className="px-4 py-3 text-ink-600">{event.category?.name}</td>
                  <td className="px-4 py-3 text-ink-600">{new Date(event.event_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-ink-600">
                    {event.available_sets} / {event.total_sets}
                  </td>
                  <td className="px-4 py-3 text-ink-600">{event.price ? `৳${event.price}` : "Free"}</td>
                  <td className="px-4 py-3">
                    {event.is_completed ? (<span className="font-medium text-signal-500">Completed</span>) : (
                      <span className="font-medium text-green-600">Available</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(event)}
                      className="mr-3 text-sm font-medium text-ink-900 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(event)}
                      className="text-sm font-medium text-signal-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit event" : "New event"} wide>
        {editing && (
          <EventForm
          initial={
            editing.id
              ? {
                  title: editing.title || "",
                  description: editing.description || "",
                  category: editing.category?.id || editing.category || "",
                  locations: editing.locations || "",
                  event_date: editing.event_date || "",
                  event_time: editing.event_time?.slice(0, 5) || "",
                  total_sets: editing.total_sets || "",
                  available_sets: editing.available_sets || "",
                  price: editing.price || "",
                }
              : undefined
          }
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            submitting={submitting}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete this event?"
        message={`"${deleting?.title}" and its bookings data will no longer be listed. This can't be undone.`}
        confirmLabel="Delete event"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={submitting}
      />
    </div>
  );
}
