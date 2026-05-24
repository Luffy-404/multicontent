import { DashboardSection } from "@/components/dashboard/DashboardSection";
import type { QuickStat } from "@/lib/dashboardTypes";

type QuickStatsProps = {
  items: QuickStat[];
};

export function QuickStats({ items }: QuickStatsProps) {
  return (
    <DashboardSection title="Quick Stats" eyebrow="Macro board">
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.key} className="border border-white/[0.06] bg-[#050608]/50 p-3">
            <p className="font-tight text-[11px] font-bold uppercase text-[#9AA4B2]">{item.label}</p>
            <p className="mt-2 font-tight text-xl font-semibold tracking-tight text-[#F8FAFC]">
              {item.value}
            </p>
            {item.change ? <p className="mt-1 text-xs text-[#9AA4B2]">{item.change}</p> : null}
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}
