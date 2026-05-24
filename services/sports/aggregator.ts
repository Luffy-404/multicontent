import { prisma } from "@/lib/prisma";
import type {
  SportsHubData,
  SportsLeague,
  SportsMatch,
  StandingRow,
  UserSportsPreferenceInput,
} from "@/lib/sportsTypes";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getSportsCache, setSportsCache } from "@/services/sports/cache";
import { rankFeaturedMatch, sortStandings, sortUpcomingMatches } from "@/services/sports/ranking";

type SeedLeague = {
  slug: string;
  name: string;
  sport: string;
  logoUrl?: string;
  teams: Array<{ name: string; logoUrl?: string }>;
};

const seedLeagues: SeedLeague[] = [
  {
    slug: "premier-league",
    name: "Premier League",
    sport: "Football",
    logoUrl: "https://placehold.co/96x96/0B0F16/6BE7FF?text=PL",
    teams: [
      { name: "Liverpool", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=LIV" },
      { name: "Arsenal", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=ARS" },
      { name: "Manchester City", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=MCI" },
      { name: "Chelsea", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=CHE" },
      { name: "Tottenham", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=TOT" },
    ],
  },
  {
    slug: "ipl",
    name: "Indian Premier League",
    sport: "Cricket",
    logoUrl: "https://placehold.co/96x96/0B0F16/6BE7FF?text=IPL",
    teams: [
      { name: "Mumbai Indians", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=MI" },
      { name: "Chennai Super Kings", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=CSK" },
      { name: "Royal Challengers", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=RCB" },
      { name: "Kolkata Knight Riders", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=KKR" },
    ],
  },
  {
    slug: "formula-one",
    name: "Formula 1",
    sport: "F1",
    logoUrl: "https://placehold.co/96x96/0B0F16/6BE7FF?text=F1",
    teams: [
      { name: "McLaren", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=MCL" },
      { name: "Ferrari", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=FER" },
      { name: "Red Bull", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=RBR" },
      { name: "Mercedes", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=MER" },
    ],
  },
  {
    slug: "nba",
    name: "NBA",
    sport: "Basketball",
    logoUrl: "https://placehold.co/96x96/0B0F16/6BE7FF?text=NBA",
    teams: [
      { name: "Boston Celtics", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=BOS" },
      { name: "Denver Nuggets", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=DEN" },
      { name: "LA Lakers", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=LAL" },
      { name: "New York Knicks", logoUrl: "https://placehold.co/96x96/111827/f8fafc?text=NYK" },
    ],
  },
];

function iso(value: Date) {
  return value.toISOString();
}

function toLeague(league: {
  id: string;
  slug: string;
  name: string;
  sport: string;
  logoUrl: string | null;
}): SportsLeague {
  return league;
}

function toMatch(match: {
  id: string;
  externalId: string | null;
  leagueId: string;
  league?: { id: string; slug: string; name: string; sport: string; logoUrl: string | null };
  homeTeam: string;
  awayTeam: string;
  homeLogo: string | null;
  awayLogo: string | null;
  startTime: Date;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  venue: string | null;
  round: string | null;
  isFeatured: boolean;
}): SportsMatch {
  return {
    ...match,
    league: match.league ? toLeague(match.league) : undefined,
    startTime: iso(match.startTime),
  };
}

function toStanding(row: {
  id: string;
  leagueId: string;
  league?: { id: string; slug: string; name: string; sport: string; logoUrl: string | null };
  team: string;
  logoUrl: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  rank: number;
  updatedAt: Date;
}): StandingRow {
  return {
    ...row,
    league: row.league ? toLeague(row.league) : undefined,
    updatedAt: iso(row.updatedAt),
  };
}

function fallbackData(): SportsHubData {
  const now = Date.now();
  const leagues: SportsLeague[] = seedLeagues.map((league, index) => ({
    id: `fallback-league-${index}`,
    slug: league.slug,
    name: league.name,
    sport: league.sport,
    logoUrl: league.logoUrl,
  }));
  const upcoming: SportsMatch[] = seedLeagues.flatMap((league, leagueIndex) =>
    league.teams.slice(0, 4).map((team, index) => {
      const opponent = league.teams[(index + 1) % league.teams.length];
      return {
        id: `fallback-match-${league.slug}-${index}`,
        externalId: `mock-${league.slug}-${index}`,
        leagueId: leagues[leagueIndex].id,
        league: leagues[leagueIndex],
        homeTeam: team.name,
        awayTeam: opponent.name,
        homeLogo: team.logoUrl,
        awayLogo: opponent.logoUrl,
        startTime: iso(new Date(now + (index + leagueIndex + 1) * 3_600_000)),
        status: leagueIndex === 0 && index === 0 ? "live" : "scheduled",
        homeScore: leagueIndex === 0 && index === 0 ? 2 : null,
        awayScore: leagueIndex === 0 && index === 0 ? 0 : null,
        venue: "Central Arena",
        round: "Matchday",
        isFeatured: leagueIndex === 0 && index === 0,
      };
    }),
  );
  const standings: StandingRow[] = seedLeagues[0].teams.map((team, index) => ({
    id: `fallback-standing-${index}`,
    leagueId: leagues[0].id,
    league: leagues[0],
    team: team.name,
    logoUrl: team.logoUrl,
    played: 28 - index,
    wins: 18 - index,
    draws: 5,
    losses: 5 + index,
    goalsFor: 62 - index * 3,
    goalsAgainst: 24 + index * 2,
    points: 68 - index * 4,
    rank: index + 1,
    updatedAt: iso(new Date()),
  }));

  return {
    leagues,
    featured: rankFeaturedMatch(upcoming),
    upcoming: sortUpcomingMatches(upcoming),
    live: upcoming.filter((match) => match.status === "live"),
    standings: sortStandings(standings),
  };
}

export async function seedSportsData() {
  const now = new Date();

  for (const seedLeague of seedLeagues) {
    const league = await prisma.sportLeague.upsert({
      where: { slug: seedLeague.slug },
      update: {
        name: seedLeague.name,
        sport: seedLeague.sport,
        logoUrl: seedLeague.logoUrl,
      },
      create: {
        slug: seedLeague.slug,
        name: seedLeague.name,
        sport: seedLeague.sport,
        logoUrl: seedLeague.logoUrl,
      },
    });

    for (let index = 0; index < seedLeague.teams.length; index += 1) {
      const team = seedLeague.teams[index];
      const opponent = seedLeague.teams[(index + 1) % seedLeague.teams.length];
      const isLive = seedLeague.slug === "premier-league" && index === 0;
      const startTime = new Date(now.getTime() + (index + 1) * 3_600_000);

      await prisma.match.upsert({
        where: {
          id: `${seedLeague.slug}-match-${index}`,
        },
        update: {
          homeTeam: team.name,
          awayTeam: opponent.name,
          homeLogo: team.logoUrl,
          awayLogo: opponent.logoUrl,
          startTime,
          status: isLive ? "live" : "scheduled",
          homeScore: isLive ? 2 : null,
          awayScore: isLive ? 0 : null,
          venue: seedLeague.sport === "F1" ? "Grand Prix Circuit" : "Central Arena",
          round: seedLeague.sport === "F1" ? "Race Weekend" : "Matchday",
          isFeatured: isLive,
        },
        create: {
          id: `${seedLeague.slug}-match-${index}`,
          externalId: `mock-${seedLeague.slug}-${index}`,
          leagueId: league.id,
          homeTeam: team.name,
          awayTeam: opponent.name,
          homeLogo: team.logoUrl,
          awayLogo: opponent.logoUrl,
          startTime,
          status: isLive ? "live" : "scheduled",
          homeScore: isLive ? 2 : null,
          awayScore: isLive ? 0 : null,
          venue: seedLeague.sport === "F1" ? "Grand Prix Circuit" : "Central Arena",
          round: seedLeague.sport === "F1" ? "Race Weekend" : "Matchday",
          isFeatured: isLive,
        },
      });

      await prisma.standings.upsert({
        where: {
          leagueId_team: {
            leagueId: league.id,
            team: team.name,
          },
        },
        update: {
          logoUrl: team.logoUrl,
          played: 28 - index,
          wins: Math.max(8, 18 - index),
          draws: 5,
          losses: 5 + index,
          goalsFor: 62 - index * 3,
          goalsAgainst: 24 + index * 2,
          points: 68 - index * 4,
          rank: index + 1,
          updatedAt: now,
        },
        create: {
          leagueId: league.id,
          team: team.name,
          logoUrl: team.logoUrl,
          played: 28 - index,
          wins: Math.max(8, 18 - index),
          draws: 5,
          losses: 5 + index,
          goalsFor: 62 - index * 3,
          goalsAgainst: 24 + index * 2,
          points: 68 - index * 4,
          rank: index + 1,
          updatedAt: now,
        },
      });
    }
  }
}

export async function getSportsHubData(leagueSlug = "premier-league"): Promise<SportsHubData> {
  const cacheKey = `sports-hub:${leagueSlug}`;
  const cached = getSportsCache<SportsHubData>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    await seedSportsData();

    const leagues = (await prisma.sportLeague.findMany({
      orderBy: [{ sport: "asc" }, { name: "asc" }],
    })).map(toLeague);
    const selectedLeague = leagues.find((league) => league.slug === leagueSlug) ?? leagues[0];
    const matches = (await prisma.match.findMany({
      where: selectedLeague ? { leagueId: selectedLeague.id } : undefined,
      include: { league: true },
      orderBy: { startTime: "asc" },
      take: 16,
    })).map(toMatch);
    const standings = (await prisma.standings.findMany({
      where: selectedLeague ? { leagueId: selectedLeague.id } : undefined,
      include: { league: true },
      orderBy: { rank: "asc" },
      take: 12,
    })).map(toStanding);

    const data: SportsHubData = {
      leagues,
      featured: rankFeaturedMatch(matches),
      upcoming: sortUpcomingMatches(matches),
      live: matches.filter((match) => match.status === "live"),
      standings: sortStandings(standings),
    };

    setSportsCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("[sports] falling back to in-memory seed data", error);
    return fallbackData();
  }
}

export async function getSportsMatches(leagueSlug?: string) {
  const data = await getSportsHubData(leagueSlug);
  return {
    featured: data.featured,
    upcoming: data.upcoming,
    live: data.live,
  };
}

export async function getSportsStandings(leagueSlug?: string) {
  const data = await getSportsHubData(leagueSlug);
  return {
    leagues: data.leagues,
    standings: data.standings,
  };
}

export async function getLiveSports(leagueSlug?: string) {
  const data = await getSportsHubData(leagueSlug);
  return {
    live: data.live,
    featured: data.featured,
  };
}

export async function saveSportsPreferences(input: UserSportsPreferenceInput, request?: Request) {
  const user = await getCurrentUser(request);

  if (!user) {
    return { saved: false, preferences: null };
  }

  const preferences = await prisma.userSportsPreference.create({
    data: {
      userId: user.id,
      sport: input.sport ?? [],
      leagues: input.leagues ?? [],
      teams: input.teams ?? [],
    },
  });

  return { saved: true, preferences };
}
