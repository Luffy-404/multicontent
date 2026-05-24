import { LeagueSelector } from "@/components/sports/LeagueSelector";
import { MatchCenter } from "@/components/sports/MatchCenter";
import { ScoreTicker } from "@/components/sports/ScoreTicker";
import { SportTabs } from "@/components/sports/SportTabs";
import { SportsCalendar } from "@/components/sports/SportsCalendar";
import { SportsStandings } from "@/components/sports/SportsStandings";
import { getSportsHubData } from "@/services/sports/aggregator";

export async function SportsHub() {
  const data = await getSportsHubData();

  return (
    <section className="relative left-1/2 mt-12 w-screen max-w-[1440px] -translate-x-1/2 px-4 sm:mt-16 md:px-6 xl:px-8">
      <div className="mb-4 flex flex-col gap-4 lg:mb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-tight text-xs font-bold uppercase tracking-[0.24em] text-[#6BE7FF]">
            Sports Center
          </p>
          <h2 className="mt-2 font-display text-[32px] font-semibold leading-[38px] text-[#F8FAFC] md:text-[40px] md:leading-[46px] lg:text-[48px] lg:leading-[52px]">
            Scores • Tables • Fixtures
          </h2>
        </div>
        <div className="grid gap-2 lg:justify-items-end">
          <SportTabs leagues={data.leagues} />
          <LeagueSelector leagues={data.leagues} activeSlug={data.featured?.league?.slug} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[0.95fr_1.1fr_0.95fr] lg:gap-6">
        <SportsCalendar matches={data.upcoming} />
        <SportsStandings rows={data.standings} />
        <div className="md:col-span-2 lg:col-span-1">
          <MatchCenter match={data.featured} />
        </div>
      </div>

      <ScoreTicker matches={data.live.length > 0 ? data.live : data.upcoming.slice(0, 4)} />
    </section>
  );
}
