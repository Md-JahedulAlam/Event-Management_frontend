import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FormField from "../components/FormField";
import Button from "../components/Button";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await adminLogin(form);
      if (user?.role !== "admin") {
        setError("This account doesn't have admin access.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-marigold-500">Admin console</p>
        <h1 className="font-display text-2xl font-semibold text-paper">Sign in to manage EventHub</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-paper/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="rounded-lg border border-paper/15 bg-ink-900 px-3.5 py-2.5 text-paper placeholder:text-paper/30 focus:border-marigold-500"
              placeholder="admin@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-paper/80">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="rounded-lg border border-paper/15 bg-ink-900 px-3.5 py-2.5 text-paper placeholder:text-paper/30 focus:border-marigold-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-signal-500">{error}</p>}
          <Button type="submit" variant="accent" loading={loading} className="mt-2 w-full">
            Enter console
          </Button>
        </form>
      </div>
    </div>
  );
}
