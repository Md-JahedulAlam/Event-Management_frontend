import { useState } from "react";

import FormField from "../../components/FormField";
import Button from "../../components/Button";

const emptyForm = {
  title: "",
  description: "",
  category_post: "",
  locations: "",
  event_date: "",
  event_time: "",
  total_sets: "",
  available_sets: "",
  price: "",
};

export default function EventForm({
  initial,
  categories,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initial,
  }));

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (image) {
      data.append("Image", image);
    }

    try {
      await onSubmit(data);
    } catch (err) {
      const res = err.response?.data;

      setError(
        res?.detail ||
          (res && Object.values(res)[0]?.[0]) ||
          "Couldn't save the event."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Title */}
      <FormField
        id="title"
        name="title"
        label="Title"
        required
        value={form.title}
        onChange={handleChange}
      />

      {/* Description */}
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

      {/* Category & Location */}
      <div className="grid grid-cols-2 gap-4">

<FormField
id="category"
name="category_post"   
label="Category"
as="select"
required
value={form.category_post}
onChange={handleChange}
>
<option value="">Select…</option>
{categories.map((c) => (
  <option key={c.id} value={c.id}>
    {c.name}
  </option>
))}
</FormField>

        <FormField
          id="locations"
          name="locations"
          label="Location"
          required
          value={form.locations}
          onChange={handleChange}
        />

      </div>

      {/* Event Date & Time */}
      <div className="grid grid-cols-2 gap-4">

        <FormField
          id="event_date"
          name="event_date"
          type="date"
          label="Event date"
          required
          value={form.event_date}
          onChange={handleChange}
        />

        <FormField
          id="event_time"
          name="event_time"
          type="time"
          label="Event time"
          required
          value={form.event_time}
          onChange={handleChange}
        />

      </div>

      {/* Seats */}
      <div className="grid grid-cols-2 gap-4">

        <FormField
          id="total_sets"
          name="total_sets"
          type="number"
          min="1"
          label="Total seats"
          required
          value={form.total_sets}
          onChange={handleChange}
        />

        <FormField
          id="available_sets"
          name="available_sets"
          type="number"
          min="0"
          label="Available seats"
          required
          value={form.available_sets}
          onChange={handleChange}
        />

      </div>

      {/* Price */}
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

      {/* Image */}
      <div className="flex flex-col gap-1.5">

        <label
          htmlFor="Image"
          className="text-sm font-medium text-ink-800"
        >
          Event image
        </label>

        <input
          id="Image"
          name="Image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-ink-900 file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-paper"
        />

      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-signal-500">
          {error}
        </p>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-2">

        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="accent"
          loading={submitting}
        >
          Save event
        </Button>

      </div>

    </form>
  );
}
