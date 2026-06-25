import type { AdminMetric } from "@/lib/editorialTypes";

export function AdminStats({ metrics }: { metrics: AdminMetric[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-[18px] border border-[color:var(--admin-line)] bg-[color:var(--admin-card)] p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--admin-muted)]">
            {metric.label}
          </p>
          <p className="mt-3 font-tight text-2xl font-semibold text-[color:var(--admin-strong)]">
            {metric.value}
          </p>
          <p className="mt-1 text-xs leading-5 text-[color:var(--admin-muted)]">{metric.detail}</p>
        </div>
      ))}
    </div>
  );
}
