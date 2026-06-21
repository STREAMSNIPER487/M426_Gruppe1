import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { simulateMatch } from './matchSimulator.ts';
import type { Team, GameResult } from './simulation.ts';

const teamA: Team = { name: 'Team A' };
const teamB: Team = { name: 'Team B' };
const teamC: Team = { name: 'Team C' };
const teams = [teamA, teamB, teamC];

describe('Teamauswahl', () => {
  test('wählt Heim- und Auswärtsteam anhand der übergebenen Indizes aus', () => {
    const { result } = simulateMatch(teams, 0, 1);
    assert.equal(result.homeTeam, teamA);
    assert.equal(result.awayTeam, teamB);
  });

  test('wirft einen Fehler bei ungültigem Team-Index', () => {
    assert.throws(() => simulateMatch(teams, 0, 99));
  });

  test('wirft einen Fehler wenn ein Team gegen sich selbst spielen würde', () => {
    assert.throws(() => simulateMatch(teams, 0, 0));
  });
});

describe('Resultat', () => {
  test('liefert ein Resultat mit gültigen Toren', () => {
    const { result } = simulateMatch(teams, 0, 1);
    assert.ok(Number.isInteger(result.homeGoals) && result.homeGoals >= 0);
    assert.ok(Number.isInteger(result.awayGoals) && result.awayGoals >= 0);
  });
});

describe('Tabelle aktualisieren', () => {
  test('Tabelle enthält ohne Vorgeschichte nur die zwei simulierten Teams', () => {
    const { standings } = simulateMatch(teams, 0, 1);
    assert.equal(standings.length, 2);
  });

  test('Tabelle berücksichtigt bisherige Resultate', () => {
    const previousResults: GameResult[] = [
      { homeTeam: teamC, awayTeam: teamA, homeGoals: 2, awayGoals: 0 },
    ];
    const { standings } = simulateMatch(teams, 0, 1, previousResults);

    assert.equal(standings.length, 3);
    const a = standings.find(e => e.team === teamA)!;
    assert.equal(a.played, 2);
  });

  test('neues Resultat spiegelt sich direkt in der Tabelle wider', () => {
    const { result, standings } = simulateMatch(teams, 0, 1);
    const home = standings.find(e => e.team === teamA)!;
    const away = standings.find(e => e.team === teamB)!;

    if (result.homeGoals > result.awayGoals) {
      assert.equal(home.points, 3);
      assert.equal(away.points, 0);
    } else if (result.homeGoals < result.awayGoals) {
      assert.equal(home.points, 0);
      assert.equal(away.points, 3);
    } else {
      assert.equal(home.points, 1);
      assert.equal(away.points, 1);
    }
  });
});
