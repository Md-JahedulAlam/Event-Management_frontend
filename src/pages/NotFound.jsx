import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="font-display text-5xl font-semibold text-ink-900">404</p>
      <p className="text-ink-600">This page took an early exit.</p>
      <Link to="/" className="font-semibold text-marigold-600 hover:underline">
        Back to events
      </Link>
    </div>
  );
}
