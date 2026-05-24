import { MatchCard } from "@/components/sports/MatchCard";
import type { SportsMatch } from "@/lib/sportsTypes";

type SportsCalendarProps = {
  matches: SportsMatch[];
};

function dayLabel(value: string) {
  const date = new Date(value);
  return {
    day: new Intl.DateTimeFormat("en", { weekday: "short" }).format(date),
    date: new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date),
  };
}

export function SportsCalendar({ matches }: SportsCalendarProps) {
  const dates = matches.slice(0, 6).map((match) => dayLabel(match.startTime));

  return (
    <section className="rounded-[20px] border border-white/[0.08] bg-[#0B0F16] p-4">
      <div className="mb-3">
        <p className="font-tight text-xs font-bold uppercase text-[#6BE7FF]">Calendar</p>
        <h3 className="mt-1 font-display text-2xl font-semibold leading-none text-[#F8FAFC]">
          Upcoming Matches
        </h3>
      </div>

      <div className="mb-3">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {dates.map((date, index) => (
            <div
              key={`${date.day}-${date.date}-${index}`}
              className={`grid h-16 min-w-0 place-items-center rounded-2xl border ${
                index === 0
                  ? "border-[#6BE7FF]/50 bg-[#6BE7FF]/10"
                  : "border-white/[0.08] bg-[#050608]"
              }`}
            >
              <span className="font-tight text-[10px] font-bold uppercase text-[#9AA4B2]">
                {date.day}
              </span>
              <span className="font-display text-2xl font-semibold leading-none text-[#F8FAFC]">
                {date.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {matches.slice(0, 3).map((match) => (
          <MatchCard key={match.id} match={match} compact />
        ))}
      </div>
    </section>
  );
}
