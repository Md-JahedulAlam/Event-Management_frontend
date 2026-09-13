import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-ink-600/10 py-8 text-center text-sm text-ink-600">
        EventHub — book the room before it fills up.
      </footer>
    </div>
  );
}
