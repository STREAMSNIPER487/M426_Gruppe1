import type { Team, GameResult } from './simulation.ts';

const WIN_POINTS = 3;
const DRAW_POINTS = 1;

export interface StandingEntry {
  team: Team;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export function createEntry(team: Team): StandingEntry {
  return {
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

export function calculateStandings(results: GameResult[]): StandingEntry[] {
  const map = new Map<string, StandingEntry>();

  for (const result of results) {
    if (!map.has(result.homeTeam.name)) map.set(result.homeTeam.name, createEntry(result.homeTeam));
    if (!map.has(result.awayTeam.name)) map.set(result.awayTeam.name, createEntry(result.awayTeam));

    const home = map.get(result.homeTeam.name)!;
    const away = map.get(result.awayTeam.name)!;

    home.played++;
    away.played++;
    home.goalsFor += result.homeGoals;
    home.goalsAgainst += result.awayGoals;
    away.goalsFor += result.awayGoals;
    away.goalsAgainst += result.homeGoals;
    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;

    if (result.homeGoals > result.awayGoals) {
      home.wins++;
      home.points += WIN_POINTS;
      away.losses++;
    } else if (result.homeGoals < result.awayGoals) {
      away.wins++;
      away.points += WIN_POINTS;
      home.losses++;
    } else {
      home.draws++;
      home.points += DRAW_POINTS;
      away.draws++;
      away.points += DRAW_POINTS;
    }
  }

  return [...map.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.name.localeCompare(b.team.name);
  });
}

export function formatStandings(standings: StandingEntry[]): string {
  const header = 'Pl  Verein                        Sp   S   U   N  Tore        Td  Pkt';
  const separator = '-'.repeat(header.length);

  const rows = standings.map((e, i) => {
    const place = String(i + 1).padStart(2);
    const name = e.team.name.padEnd(30);
    const played = String(e.played).padStart(3);
    const wins = String(e.wins).padStart(4);
    const draws = String(e.draws).padStart(4);
    const losses = String(e.losses).padStart(4);
    const goals = `${e.goalsFor}:${e.goalsAgainst}`.padStart(8);
    const diff = String(e.goalDifference).padStart(5);
    const pts = String(e.points).padStart(5);
    return `${place}  ${name}${played}${wins}${draws}${losses}${goals}${diff}${pts}`;
  });

  return [header, separator, ...rows].join('\n');
}
