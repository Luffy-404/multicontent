import type { SportsLeague } from "@/lib/sportsTypes";

type SportTabsProps = {
  leagues: SportsLeague[];
};

export function SportTabs({ leagues }: SportTabsProps) {
  const sports = Array.from(new Set(leagues.map((league) => league.sport)));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {sports.map((sport, index) => (
          <span
            key={sport}
            className={`inline-flex h-10 items-center rounded-full border px-3 font-tight text-[11px] font-bold uppercase ${
              index === 0
                ? "border-[#6BE7FF]/50 text-[#F8FAFC]"
                : "border-white/[0.08] text-[#9AA4B2]"
            }`}
          >
            {sport}
          </span>
        ))}
      </div>
    </div>
  );
}
