export default function FormField({
  label,
  id,
  error,
  as = "input",
  children,
  className = "",
  ...props
}) {
  const Tag = as;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-800">
        {label}
      </label>
      {as === "select" ? (
        <Tag
          id={id}
          className={`rounded-lg border border-ink-600/20 bg-white px-3.5 py-2.5 text-ink-900 focus:border-marigold-500 ${className}`}
          {...props}
        >
          {children}
        </Tag>
      ) : (
        <Tag
          id={id}
          className={`rounded-lg border border-ink-600/20 bg-white px-3.5 py-2.5 text-ink-900 placeholder:text-ink-600/50 focus:border-marigold-500 ${className}`}
          {...props}
        />
      )}
      {error && <span className="text-sm text-signal-500">{error}</span>}
    </div>
  );
}
