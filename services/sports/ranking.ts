import type { SportsMatch, StandingRow } from "@/lib/sportsTypes";

function toTime(value: string) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function rankFeaturedMatch(matches: SportsMatch[]) {
  return [...matches].sort((a, b) => {
    if (a.status === "live" && b.status !== "live") return -1;
    if (b.status === "live" && a.status !== "live") return 1;
    if (a.isFeatured !== b.isFeatured) return Number(b.isFeatured) - Number(a.isFeatured);
    return toTime(a.startTime) - toTime(b.startTime);
  })[0] ?? null;
}

export function sortUpcomingMatches(matches: SportsMatch[]) {
  const now = Date.now();

  return [...matches]
    .filter((match) => match.status !== "finished" && toTime(match.startTime) >= now - 7_200_000)
    .sort((a, b) => toTime(a.startTime) - toTime(b.startTime));
}

export function sortStandings(rows: StandingRow[]) {
  return [...rows].sort((a, b) => a.rank - b.rank || b.points - a.points);
}
