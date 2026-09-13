const variants = {
  primary: "bg-ink-900 text-paper hover:bg-ink-800",
  accent: "bg-marigold-500 text-ink-950 hover:bg-marigold-600",
  ghost: "bg-transparent text-ink-900 border border-ink-600/25 hover:border-ink-900",
  danger: "bg-signal-500 text-white hover:bg-signal-500/90",
};

export default function Button({
  variant = "primary",
  className = "",
  loading = false,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
