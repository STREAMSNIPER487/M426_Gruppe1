import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { simulateGame, simulateSeason, expectedGoals, bundesligaTeams } from './simulation.ts';
import type { Team } from './simulation.ts';

/** Deterministischer Zufallsgenerator (mulberry32) für reproduzierbare Tests. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const strong: Team = { name: 'Stark', strength: 90 };
const weak: Team = { name: 'Schwach', strength: 45 };

describe('Stärkewerte der Teams', () => {
  test('jedes Bundesliga-Team besitzt einen positiven Stärkewert', () => {
    assert.equal(bundesligaTeams.length, 18);
    for (const team of bundesligaTeams) {
      assert.ok(typeof team.strength === 'number', `${team.name} hat keinen Stärkewert`);
      assert.ok(team.strength > 0, `${team.name} hat keinen positiven Stärkewert`);
    }
  });
});

describe('expectedGoals', () => {
  test('gleich starke Teams erwarten gleich viele Tore', () => {
    assert.equal(expectedGoals(60, 60), expectedGoals(60, 60));
  });

  test('ein stärkeres Team erwartet mehr Tore als ein schwächeres', () => {
    assert.ok(expectedGoals(90, 45) > expectedGoals(45, 90));
  });

  test('grösserer Stärkeunterschied bedeutet mehr erwartete Tore', () => {
    assert.ok(expectedGoals(90, 45) > expectedGoals(70, 60));
  });
});

describe('simulateGame liefert gültige Resultate', () => {
  test('Tore sind nicht-negative ganze Zahlen', () => {
    const random = seededRandom(1);
    for (let i = 0; i < 100; i++) {
      const result = simulateGame(strong, weak, random);
      assert.ok(Number.isInteger(result.homeGoals) && result.homeGoals >= 0);
      assert.ok(Number.isInteger(result.awayGoals) && result.awayGoals >= 0);
    }
  });

  test('gleicher Seed ergibt reproduzierbares Resultat', () => {
    const a = simulateGame(strong, weak, seededRandom(42));
    const b = simulateGame(strong, weak, seededRandom(42));
    assert.deepEqual(a, b);
  });
});

describe('Stärke beeinflusst die Resultate', () => {
  const RUNS = 1000;

  function countWins(home: Team, away: Team, random: () => number) {
    let homeWins = 0;
    let awayWins = 0;
    let homeGoalsTotal = 0;
    let awayGoalsTotal = 0;
    for (let i = 0; i < RUNS; i++) {
      const { homeGoals, awayGoals } = simulateGame(home, away, random);
      homeGoalsTotal += homeGoals;
      awayGoalsTotal += awayGoals;
      if (homeGoals > awayGoals) homeWins++;
      else if (awayGoals > homeGoals) awayWins++;
    }
    return { homeWins, awayWins, homeGoalsTotal, awayGoalsTotal };
  }

  test('das stärkere Team gewinnt deutlich häufiger', () => {
    const { homeWins, awayWins } = countWins(strong, weak, seededRandom(7));
    assert.ok(homeWins > awayWins, `stark: ${homeWins} Siege, schwach: ${awayWins} Siege`);
  });

  test('das stärkere Team erzielt im Schnitt mehr Tore', () => {
    const { homeGoalsTotal, awayGoalsTotal } = countWins(strong, weak, seededRandom(7));
    assert.ok(homeGoalsTotal > awayGoalsTotal);
  });

  test('das schwächere Team kann trotzdem gewinnen', () => {
    const { awayWins } = countWins(strong, weak, seededRandom(7));
    assert.ok(awayWins > 0, 'das schwächere Team hat in keinem von 1000 Spielen gewonnen');
  });
});

describe('simulateSeason berücksichtigt die Stärken', () => {
  test('das stärkste Team holt über die Saison mehr Tore als das schwächste', () => {
    const teams: Team[] = [
      { name: 'Top', strength: 95 },
      { name: 'Mitte', strength: 60 },
      { name: 'Flop', strength: 40 },
    ];
    const results = simulateSeason(teams, seededRandom(3));

    const goalsFor = (name: string) =>
      results
        .filter(r => r.homeTeam.name === name)
        .reduce((sum, r) => sum + r.homeGoals, 0) +
      results
        .filter(r => r.awayTeam.name === name)
        .reduce((sum, r) => sum + r.awayGoals, 0);

    assert.ok(goalsFor('Top') > goalsFor('Flop'));
  });
});
