export type SportKind = "Football" | "Cricket" | "F1" | "Basketball";

export type MatchStatus = "scheduled" | "live" | "finished";

export type SportsLeague = {
  id: string;
  slug: string;
  name: string;
  sport: SportKind | string;
  logoUrl?: string | null;
};

export type SportsMatch = {
  id: string;
  externalId?: string | null;
  leagueId: string;
  league?: SportsLeague;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string | null;
  awayLogo?: string | null;
  startTime: string;
  status: MatchStatus | string;
  homeScore?: number | null;
  awayScore?: number | null;
  venue?: string | null;
  round?: string | null;
  isFeatured: boolean;
};

export type StandingRow = {
  id: string;
  leagueId: string;
  league?: SportsLeague;
  team: string;
  logoUrl?: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  rank: number;
  updatedAt: string;
};

export type SportsHubData = {
  leagues: SportsLeague[];
  featured: SportsMatch | null;
  upcoming: SportsMatch[];
  live: SportsMatch[];
  standings: StandingRow[];
};

export type UserSportsPreferenceInput = {
  sport?: string[];
  leagues?: string[];
  teams?: string[];
};
