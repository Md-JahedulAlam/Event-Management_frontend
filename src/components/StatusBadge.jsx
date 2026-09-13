const styles = {
  confirmed: "bg-moss-500/10 text-moss-500",
  cancelled: "bg-signal-500/10 text-signal-500",
  pending: "bg-marigold-500/15 text-marigold-600",
};

export default function StatusBadge({ status }) {
  const key = status?.toLowerCase() ?? "pending";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[key] ?? styles.pending}`}>
      {status}
    </span>
  );
}
