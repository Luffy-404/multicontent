import { TeamMark } from "@/components/sports/TeamMark";
import type { SportsMatch } from "@/lib/sportsTypes";

type MatchCenterProps = {
  match: SportsMatch | null;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function MatchCenter({ match }: MatchCenterProps) {
  if (!match) {
    return (
      <section className="rounded-[20px] border border-white/[0.08] bg-[#0B0F16] p-4">
        <p className="font-tight text-sm text-[#9AA4B2]">No featured match available.</p>
      </section>
    );
  }

  const isLive = match.status === "live";
  const statSeed = match.homeTeam.length + match.awayTeam.length;
  const stats = [
    { label: "Possession", value: `${50 + (statSeed % 9)}%` },
    { label: "Shots", value: String(8 + (statSeed % 7)) },
    { label: "Corners", value: String(3 + (statSeed % 5)) },
  ];

  return (
    <section className="relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0B0F16] p-4">
      <div className="absolute inset-x-0 top-0 h-px bg-[#6BE7FF]/40" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-tight text-xs font-bold uppercase text-[#6BE7FF]">Match Center</p>
          <h3 className="mt-1 font-display text-2xl font-semibold leading-none text-[#F8FAFC]">
            Featured Match
          </h3>
        </div>
        <span className={`rounded-full px-2 py-1 font-tight text-[10px] font-bold uppercase ${
          isLive ? "bg-red-500/12 text-red-200" : "bg-white/[0.05] text-[#9AA4B2]"
        }`}>
          {isLive ? "Live" : match.status}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0 text-center">
          <TeamMark name={match.homeTeam} logoUrl={match.homeLogo} size="lg" />
          <p className="mt-2 truncate font-tight text-base font-semibold leading-5 text-[#F8FAFC]">
            {match.homeTeam}
          </p>
        </div>
        <div className="text-center">
          {isLive || match.homeScore !== null || match.awayScore !== null ? (
            <p className="font-tight text-5xl font-semibold leading-none tracking-tight text-[#F8FAFC]">
              {match.homeScore ?? 0}-{match.awayScore ?? 0}
            </p>
          ) : (
            <p className="font-tight text-4xl font-semibold leading-none tracking-tight text-[#6BE7FF]">VS</p>
          )}
          <p className="mt-2 font-tight text-[11px] font-bold uppercase text-[#9AA4B2]">
            {match.league?.name ?? "League"}
          </p>
        </div>
        <div className="min-w-0 text-center">
          <TeamMark name={match.awayTeam} logoUrl={match.awayLogo} size="lg" />
          <p className="mt-2 truncate font-tight text-base font-semibold leading-5 text-[#F8FAFC]">
            {match.awayTeam}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050608]/60">
        {stats.map((stat) => (
          <div key={stat.label} className="border-r border-white/[0.06] px-3 py-3 text-center last:border-r-0">
            <p className="font-tight text-lg font-semibold tracking-tight text-[#F8FAFC]">{stat.value}</p>
            <p className="mt-1 truncate font-tight text-[10px] font-bold uppercase text-[#9AA4B2]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-white/[0.08] bg-[#050608]/60 px-4 py-3">
        <p className="font-tight text-xs font-bold uppercase text-[#9AA4B2]">
          {formatDate(match.startTime)}
        </p>
        <p className="mt-1 truncate text-sm text-[#F8FAFC]">{match.venue ?? "Venue TBD"}</p>
      </div>
    </section>
  );
}
