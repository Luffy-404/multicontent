import { DashboardSection } from "@/components/dashboard/DashboardSection";
import type { CryptoItem } from "@/lib/dashboardTypes";

type CryptoBoardProps = {
  items: CryptoItem[];
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: value > 1000 ? 0 : 2,
    style: "currency",
    currency: "USD",
  });
}

function formatVolume(value: number) {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }

  return `$${(value / 1_000_000).toFixed(1)}M`;
}

export function CryptoBoard({ items }: CryptoBoardProps) {
  return (
    <DashboardSection title="Crypto" eyebrow="24h market">
      <div className="overflow-hidden border border-white/[0.06]">
        {items.map((item) => (
          <div key={item.symbol} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-white/[0.06] px-3 py-3 last:border-b-0">
            <div>
              <p className="font-tight text-sm font-semibold text-[#F8FAFC]">{item.symbol}</p>
              <p className="text-xs text-[#9AA4B2]">{item.name}</p>
            </div>
            <div className="text-right">
              <p className="font-tight text-sm font-semibold tabular-nums text-[#F8FAFC]">
                {formatCurrency(item.price)}
              </p>
              <p className="text-xs text-[#9AA4B2]">Vol {formatVolume(item.volume)}</p>
            </div>
            <p className={`font-tight text-sm font-semibold tabular-nums ${item.change24h >= 0 ? "text-[#6BE7FF]" : "text-[#9AA4B2]"}`}>
              {item.change24h >= 0 ? "+" : ""}{item.change24h.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}
