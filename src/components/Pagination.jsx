export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-6" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-900/5 disabled:opacity-30"
      >
        Prev
      </button>
      {pages.map((p, idx) => (
        <span key={p} className="flex items-center">
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-ink-600/40">…</span>}
          <button
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`h-9 w-9 rounded-lg text-sm font-medium ${
              p === page ? "bg-ink-900 text-paper" : "text-ink-700 hover:bg-ink-900/5"
            }`}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-900/5 disabled:opacity-30"
      >
        Next
      </button>
    </nav>
  );
}
