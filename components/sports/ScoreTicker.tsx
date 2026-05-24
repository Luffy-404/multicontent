import type { SportsMatch } from "@/lib/sportsTypes";

type ScoreTickerProps = {
  matches: SportsMatch[];
};

export function ScoreTicker({ matches }: ScoreTickerProps) {
  const tickerMatches = matches.length > 0 ? matches : [];
  const tickerItems = [...tickerMatches, ...tickerMatches];

  if (tickerMatches.length === 0) {
    return null;
  }

  return (
    <div className="group relative mt-4 h-12 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0B0F16]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0B0F16] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0B0F16] to-transparent" />
      <div className="sports-ticker flex h-full min-w-max items-center gap-6 px-4 group-hover:[animation-play-state:paused]">
        {tickerItems.map((match, index) => (
          <div key={`${match.id}-${index}`} className="flex items-center gap-3 font-tight text-sm">
            <span className="rounded-full bg-red-500/12 px-2 py-1 text-[10px] font-bold uppercase text-red-200">
              {match.status === "live" ? "Live" : match.league?.sport ?? "Sport"}
            </span>
            <span className="font-semibold text-[#F8FAFC]">{match.homeTeam}</span>
            <span className="font-bold text-[#6BE7FF]">
              {match.homeScore ?? "-"}-{match.awayScore ?? "-"}
            </span>
            <span className="font-semibold text-[#F8FAFC]">{match.awayTeam}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
