type StatusBadgeProps = {
  status: "Yayında" | "Taslak" | "Satıldı" | "İncelemede";
};

const statusClasses: Record<StatusBadgeProps["status"], string> = {
  Yayında: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Taslak: "border-amber-200 bg-amber-50 text-amber-700",
  Satıldı: "border-slate-200 bg-slate-100 text-slate-700",
  İncelemede: "border-sky-200 bg-sky-50 text-sky-700",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
