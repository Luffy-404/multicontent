import type { SportsLeague } from "@/lib/sportsTypes";

type LeagueSelectorProps = {
  leagues: SportsLeague[];
  activeSlug?: string;
};

export function LeagueSelector({ leagues, activeSlug }: LeagueSelectorProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {leagues.map((league, index) => {
          const active = league.slug === activeSlug || (!activeSlug && index === 0);

          return (
            <span
              key={league.id}
              className={`inline-flex h-10 items-center rounded-full border px-3 font-tight text-[11px] font-bold uppercase ${
                active
                  ? "border-[#6BE7FF]/50 text-[#F8FAFC]"
                  : "border-white/[0.08] text-[#9AA4B2]"
              }`}
            >
              {league.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
