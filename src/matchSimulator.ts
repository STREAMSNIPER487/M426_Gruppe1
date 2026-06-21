import { simulateGame } from './simulation.ts';
import type { Team, GameResult } from './simulation.ts';
import { calculateStandings } from './standings.ts';
import type { StandingEntry } from './standings.ts';

export interface MatchSimulation {
  result: GameResult;
  standings: StandingEntry[];
}

export function simulateMatch(
  teams: Team[],
  homeTeamIndex: number,
  awayTeamIndex: number,
  previousResults: GameResult[] = [],
): MatchSimulation {
  if (homeTeamIndex === awayTeamIndex) {
    throw new Error('Ein Team kann nicht gegen sich selbst spielen');
  }

  const homeTeam = teams[homeTeamIndex];
  const awayTeam = teams[awayTeamIndex];
  if (!homeTeam || !awayTeam) {
    throw new Error('Ungültige Teamauswahl');
  }

  const result = simulateGame(homeTeam, awayTeam);
  const standings = calculateStandings([...previousResults, result]);

  return { result, standings };
}
