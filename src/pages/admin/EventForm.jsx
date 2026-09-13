import { useState } from "react";
import FormField from "../../components/FormField";
import Button from "../../components/Button";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  date: "",
  price: "",
  total_seats: "",
};

export default function EventForm({ initial, categories, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(() => ({ ...emptyForm, ...initial }));
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      await onSubmit(data);
    } catch (err) {
      const res = err.response?.data;
      setError(res?.detail || (res && Object.values(res)[0]?.[0]) || "Couldn't save the event.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField id="title" name="title" label="Title" required value={form.title} onChange={handleChange} />
      <FormField
        id="description"
        name="description"
        label="Description"
        as="textarea"
        rows={4}
        required
        value={form.description}
        onChange={handleChange}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField id="category" name="category" label="Category" as="select" required value={form.category} onChange={handleChange}>
          <option value="">Select…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </FormField>
        <FormField
          id="date"
          name="date"
          type="datetime-local"
          label="Date & time"
          required
          value={form.date}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          label="Price (৳, 0 for free)"
          required
          value={form.price}
          onChange={handleChange}
        />
        <FormField
          id="total_seats"
          name="total_seats"
          type="number"
          min="1"
          label="Total seats"
          required
          value={form.total_seats}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="image" className="text-sm font-medium text-ink-800">
          Event image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-ink-900 file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-paper"
        />
      </div>

      {error && <p className="text-sm text-signal-500">{error}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="accent" loading={submitting}>
          Save event
        </Button>
      </div>
    </form>
  );
}
