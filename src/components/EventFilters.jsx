const orderingOptions = [
  { value: "date", label: "Date: soonest first" },
  { value: "-date", label: "Date: latest first" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
];

export default function EventFilters({ search, onSearch, category, onCategory, ordering, onOrdering, categories }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink-600/15 bg-white p-4 sm:flex-row sm:items-center">
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search events…"
        className="flex-1 rounded-lg border border-ink-600/20 px-3.5 py-2.5 text-sm focus:border-marigold-500"
      />
      <select
        value={category}
        onChange={(e) => onCategory(e.target.value)}
        className="rounded-lg border border-ink-600/20 px-3.5 py-2.5 text-sm focus:border-marigold-500"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        value={ordering}
        onChange={(e) => onOrdering(e.target.value)}
        className="rounded-lg border border-ink-600/20 px-3.5 py-2.5 text-sm focus:border-marigold-500"
      >
        {orderingOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
