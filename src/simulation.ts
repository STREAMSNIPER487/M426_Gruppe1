import * as fs from 'fs';

export interface Team {
  name: string;
}

export interface GameResult {
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
}

export const bundesligaTeams: Team[] = [
  { name: 'Bayern München' },
  { name: 'Borussia Dortmund' },
  { name: 'Bayer Leverkusen' },
  { name: 'RB Leipzig' },
  { name: 'Eintracht Frankfurt' },
  { name: 'SC Freiburg' },
  { name: 'Union Berlin' },
  { name: 'Borussia Mönchengladbach' },
  { name: 'Werder Bremen' },
  { name: 'FC Augsburg' },
  { name: 'VfL Wolfsburg' },
  { name: 'VfB Stuttgart' },
  { name: 'TSG Hoffenheim' },
  { name: 'FC Heidenheim' },
  { name: 'SV Darmstadt 98' },
  { name: 'VfL Bochum' },
  { name: '1. FC Köln' },
  { name: 'FC Mainz 05' },
];

export function simulateGame(homeTeam: Team, awayTeam: Team): GameResult {
  return {
    homeTeam,
    awayTeam,
    homeGoals: Math.floor(Math.random() * 6),
    awayGoals: Math.floor(Math.random() * 6),
  };
}

export function simulateSeason(teams: Team[]): GameResult[] {
  const results: GameResult[] = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = 0; j < teams.length; j++) {
      if (i !== j) {
        results.push(simulateGame(teams[i], teams[j]));
      }
    }
  }
  return results;
}

export function saveResults(results: GameResult[], path: string = 'results.json'): void {
  fs.writeFileSync(path, JSON.stringify(results, null, 2), 'utf-8');
}
