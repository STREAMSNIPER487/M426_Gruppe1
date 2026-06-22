import * as fs from 'fs';

export interface Team {
  name: string;
  /** Spielstärke des Teams (höher = stärker). Sinnvoller Bereich: 1–100. */
  strength: number;
}

export interface GameResult {
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
}

export const bundesligaTeams: Team[] = [
  { name: 'Bayern München', strength: 92 },
  { name: 'Borussia Dortmund', strength: 84 },
  { name: 'Bayer Leverkusen', strength: 90 },
  { name: 'RB Leipzig', strength: 83 },
  { name: 'Eintracht Frankfurt', strength: 75 },
  { name: 'SC Freiburg', strength: 72 },
  { name: 'Union Berlin', strength: 63 },
  { name: 'Borussia Mönchengladbach', strength: 62 },
  { name: 'Werder Bremen', strength: 65 },
  { name: 'FC Augsburg', strength: 66 },
  { name: 'VfL Wolfsburg', strength: 64 },
  { name: 'VfB Stuttgart', strength: 80 },
  { name: 'TSG Hoffenheim', strength: 70 },
  { name: 'FC Heidenheim', strength: 52 },
  { name: 'SV Darmstadt 98', strength: 48 },
  { name: 'VfL Bochum', strength: 54 },
  { name: '1. FC Köln', strength: 55 },
  { name: 'FC Mainz 05', strength: 58 },
];

/** Durchschnittlich erwartete Tore eines Teams bei gleich starkem Gegner. */
const BASE_GOALS = 1.5;

/**
 * Erwartete Tore (λ) eines Teams, abhängig vom Verhältnis der eigenen Stärke
 * zur Stärke des Gegners. Gleich starke Teams erwarten je {@link BASE_GOALS}
 * Tore; ein stärkeres Team erwartet mehr, ein schwächeres weniger.
 */
export function expectedGoals(teamStrength: number, opponentStrength: number): number {
  return BASE_GOALS * (teamStrength / opponentStrength);
}

/**
 * Zieht eine ganzzahlige Toranzahl aus einer Poisson-Verteilung mit Erwartungswert
 * `lambda` (Knuth-Algorithmus). Durch die Streuung kann auch ein schwächeres Team
 * gewinnen, während das stärkere im Mittel mehr Tore erzielt.
 */
function samplePoissonGoals(lambda: number, random: () => number): number {
  const limit = Math.exp(-lambda);
  let goals = 0;
  let product = 1;
  do {
    goals++;
    product *= random();
  } while (product > limit);
  return goals - 1;
}

export function simulateGame(
  homeTeam: Team,
  awayTeam: Team,
  random: () => number = Math.random,
): GameResult {
  return {
    homeTeam,
    awayTeam,
    homeGoals: samplePoissonGoals(expectedGoals(homeTeam.strength, awayTeam.strength), random),
    awayGoals: samplePoissonGoals(expectedGoals(awayTeam.strength, homeTeam.strength), random),
  };
}

export function simulateSeason(teams: Team[], random: () => number = Math.random): GameResult[] {
  const results: GameResult[] = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = 0; j < teams.length; j++) {
      if (i !== j) {
        results.push(simulateGame(teams[i], teams[j], random));
      }
    }
  }
  return results;
}

export function saveResults(results: GameResult[], path: string = 'results.json'): void {
  fs.writeFileSync(path, JSON.stringify(results, null, 2), 'utf-8');
}
