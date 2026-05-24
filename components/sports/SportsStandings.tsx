import { TeamMark } from "@/components/sports/TeamMark";
import type { StandingRow } from "@/lib/sportsTypes";

type SportsStandingsProps = {
  rows: StandingRow[];
};

export function SportsStandings({ rows }: SportsStandingsProps) {
  return (
    <section className="rounded-[20px] border border-white/[0.08] bg-[#0B0F16] p-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="font-tight text-xs font-bold uppercase text-[#6BE7FF]">Standings</p>
          <h3 className="mt-1 font-display text-2xl font-semibold leading-none text-[#F8FAFC]">
            Live Table
          </h3>
        </div>
      </div>

      <div className="max-h-[313px] overflow-auto rounded-2xl border border-white/[0.08]">
        <div className="sticky top-0 z-10 grid h-[52px] grid-cols-[2rem_1fr_1.9rem_1.9rem_1.9rem_2.6rem] items-center gap-2 border-b border-white/[0.08] bg-[#0B0F16] px-3 font-tight text-[10px] font-bold uppercase text-[#9AA4B2]">
          <span>#</span>
          <span>Team</span>
          <span className="text-center">W</span>
          <span className="text-center">D</span>
          <span className="text-center">L</span>
          <span className="text-right">Pts</span>
        </div>
        {rows.slice(0, 5).map((row) => (
          <div
            key={row.id}
            className="grid h-[52px] grid-cols-[2rem_1fr_1.9rem_1.9rem_1.9rem_2.6rem] items-center gap-2 border-b border-white/[0.06] bg-[#050608]/55 px-3 last:border-b-0"
          >
            <span className="font-tight text-xs font-bold text-[#9AA4B2]">{row.rank}</span>
            <div className="flex min-w-0 items-center gap-2">
              <TeamMark name={row.team} logoUrl={row.logoUrl} size="sm" />
              <span className="truncate font-tight text-sm font-semibold text-[#F8FAFC]">
                {row.team}
              </span>
            </div>
            <span className="text-center font-tight text-xs text-[#9AA4B2]">{row.wins}</span>
            <span className="text-center font-tight text-xs text-[#9AA4B2]">{row.draws}</span>
            <span className="text-center font-tight text-xs text-[#9AA4B2]">{row.losses}</span>
            <span className="text-right font-tight text-sm font-extrabold tracking-tight text-[#F8FAFC]">{row.points}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
