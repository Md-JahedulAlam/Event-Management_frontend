import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FormField from "../components/FormField";
import Button from "../components/Button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password_confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.detail || (data && Object.values(data)[0]?.[0]) || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <p className="text-xs font-semibold tracking-wide uppercase text-marigold-600">Get started</p>
      <h1 className="text-3xl font-semibold font-display text-ink-900">Create your account</h1>
      <p className="mt-2 text-sm text-ink-600">Takes less than a minute.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
        <FormField
          id="username"
          name="username"
          label="Name"
          placeholder="Your name"
          required
          value={form.username}
          onChange={handleChange}
        />
        <FormField
          id="phone_number"
          name="phone_number"
          type="tel"
          label="Phone number"
          placeholder="Your phone number"
          required
          value={form.phone_number}
          onChange={handleChange}
        />
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
          placeholder="At least 8 characters"
          required
          minLength={8}
          value={form.password}
          onChange={handleChange}
        />
        <FormField
          id="password_confirm"
          name="password_confirm"
          type="password"
          label="Confirm password"
          placeholder="Re-enter your password"
          required
          value={form.password_confirm}
          onChange={handleChange}
        />
        {error && <p className="text-sm text-signal-500">{error}</p>}
        <Button type="submit" variant="accent" loading={loading} className="w-full mt-2">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-sm text-center text-ink-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-ink-900 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
