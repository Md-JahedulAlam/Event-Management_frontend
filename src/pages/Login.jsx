import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FormField from "../components/FormField";
import Button from "../components/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from ?? "/");
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't log you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-marigold-600">Welcome back</p>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Log in to EventHub</h1>
      <p className="mt-2 text-sm text-ink-600">Book tickets and track your upcoming events.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={handleChange}
        />
        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          required
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="text-sm text-signal-500">{error}</p>}
        <Button type="submit" variant="accent" loading={loading} className="mt-2 w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600">
        New here?{" "}
        <Link to="/register" className="font-semibold text-ink-900 hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-ink-600/70">
        <Link to="/admin/login" className="hover:underline">
          Admin login
        </Link>
      </p>
    </div>
  );
}
