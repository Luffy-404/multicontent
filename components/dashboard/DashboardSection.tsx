import type { ReactNode } from "react";

type DashboardSectionProps = {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function DashboardSection({
  title,
  eyebrow,
  action,
  className = "",
  children,
}: DashboardSectionProps) {
  return (
    <section className={`border border-white/[0.08] bg-[#0B0F16] p-4 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {eyebrow ? (
            <p className="font-tight text-[11px] font-bold uppercase tracking-[0.18em] text-[#9AA4B2]">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="mt-1 font-display text-3xl font-semibold leading-none text-[#F8FAFC]">
            {title}
          </h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
