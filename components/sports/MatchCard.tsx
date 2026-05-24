import { TeamMark } from "@/components/sports/TeamMark";
import type { SportsMatch } from "@/lib/sportsTypes";

type MatchCardProps = {
  match: SportsMatch;
  compact?: boolean;
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function MatchCard({ match, compact = false }: MatchCardProps) {
  const isLive = match.status === "live";

  return (
    <article className="rounded-[20px] border border-white/[0.08] bg-[#050608]/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="truncate font-tight text-[11px] font-bold uppercase text-[#9AA4B2]">
          {match.league?.name ?? "League"} / {match.round ?? "Fixture"}
        </p>
        <span className={`shrink-0 rounded-full px-2 py-1 font-tight text-[10px] font-bold uppercase ${
          isLive ? "bg-red-500/12 text-red-200" : "bg-white/[0.04] text-[#9AA4B2]"
        }`}>
          {isLive ? "Live" : formatTime(match.startTime)}
        </span>
      </div>

      <div className={`grid items-center gap-3 ${compact ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-[1fr_auto_1fr]"}`}>
        <div className="min-w-0 text-center">
          <TeamMark name={match.homeTeam} logoUrl={match.homeLogo} />
          <p className="mt-2 truncate font-tight text-[13px] font-semibold leading-4 text-[#F8FAFC]">
            {match.homeTeam}
          </p>
        </div>
        <div className="text-center">
          {isLive || match.homeScore !== null || match.awayScore !== null ? (
            <p className="font-tight text-2xl font-semibold tracking-tight text-[#F8FAFC]">
              {match.homeScore ?? 0}-{match.awayScore ?? 0}
            </p>
          ) : (
            <p className="font-tight text-xl font-semibold tracking-tight text-[#6BE7FF]">VS</p>
          )}
          <p className="mt-1 font-tight text-[10px] font-bold uppercase text-[#9AA4B2]">
            {match.venue ?? "TBD"}
          </p>
        </div>
        <div className="min-w-0 text-center">
          <TeamMark name={match.awayTeam} logoUrl={match.awayLogo} />
          <p className="mt-2 truncate font-tight text-[13px] font-semibold leading-4 text-[#F8FAFC]">
            {match.awayTeam}
          </p>
        </div>
      </div>
    </article>
  );
}
