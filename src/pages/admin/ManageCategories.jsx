import { useEffect, useState } from "react";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../api/categories";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import FormField from "../../components/FormField";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetchCategories()
      .then(({ data }) => setCategories(data.results ?? data))
      .catch(() => setError("Couldn't load categories."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openEdit = (cat) => {
    setEditing(cat ?? {});
    setName(cat?.name ?? "");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editing.id) {
        await updateCategory(editing.id, { name });
      } else {
        await createCategory({ name });
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.name?.[0] || "Couldn't save that category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteCategory(deleting.id);
      setDeleting(null);
      load();
    } catch {
      setError("Couldn't delete — it may still have events attached.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-marigold-600">Manage</p>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Categories</h1>
        </div>
        <Button variant="accent" onClick={() => openEdit(null)}>
          New category
        </Button>
      </div>

      {error && <p className="text-sm text-signal-500">{error}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-ink-600/10" />)
        ) : categories.length === 0 ? (
          <p className="text-ink-600">No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-xl border border-ink-600/15 bg-white p-4"
            >
              <span className="font-medium text-ink-900">{cat.name}</span>
              <div className="flex gap-3 text-sm">
                <button onClick={() => openEdit(cat)} className="font-medium text-ink-900 hover:underline">
                  Edit
                </button>
                <button onClick={() => setDeleting(cat)} className="font-medium text-signal-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit category" : "New category"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField id="name" label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
          {error && <p className="text-sm text-signal-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" loading={submitting}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete this category?"
        message={`"${deleting?.name}" will be removed. Events using it may need reassigning.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={submitting}
      />
    </div>
  );
}
