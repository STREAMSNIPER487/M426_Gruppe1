import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateStandings, createEntry } from './standings.ts';
import type { GameResult, Team } from './simulation.ts';

const teamA: Team = { name: 'Team A' };
const teamB: Team = { name: 'Team B' };
const teamC: Team = { name: 'Team C' };

function makeResult(home: Team, away: Team, homeGoals: number, awayGoals: number): GameResult {
  return { homeTeam: home, awayTeam: away, homeGoals, awayGoals };
}

describe('createEntry', () => {
  test('erstellt einen Eintrag mit Nullwerten', () => {
    const entry = createEntry(teamA);
    assert.equal(entry.played, 0);
    assert.equal(entry.points, 0);
    assert.equal(entry.goalDifference, 0);
  });
});

describe('3-Punkte-Regel', () => {
  test('Sieg gibt dem Gewinner 3 Punkte', () => {
    const standings = calculateStandings([makeResult(teamA, teamB, 2, 0)]);
    const a = standings.find(e => e.team.name === 'Team A')!;
    assert.equal(a.points, 3);
  });

  test('Niederlage gibt 0 Punkte', () => {
    const standings = calculateStandings([makeResult(teamA, teamB, 2, 0)]);
    const b = standings.find(e => e.team.name === 'Team B')!;
    assert.equal(b.points, 0);
  });

  test('Unentschieden gibt beiden Teams je 1 Punkt', () => {
    const standings = calculateStandings([makeResult(teamA, teamB, 1, 1)]);
    const a = standings.find(e => e.team.name === 'Team A')!;
    const b = standings.find(e => e.team.name === 'Team B')!;
    assert.equal(a.points, 1);
    assert.equal(b.points, 1);
  });
});

describe('Tordifferenz', () => {
  test('wird korrekt berechnet bei Sieg', () => {
    const standings = calculateStandings([makeResult(teamA, teamB, 3, 1)]);
    const a = standings.find(e => e.team.name === 'Team A')!;
    const b = standings.find(e => e.team.name === 'Team B')!;
    assert.equal(a.goalDifference, 2);
    assert.equal(b.goalDifference, -2);
  });

  test('ist null bei Unentschieden mit gleichen Toren', () => {
    const standings = calculateStandings([makeResult(teamA, teamB, 2, 2)]);
    const a = standings.find(e => e.team.name === 'Team A')!;
    assert.equal(a.goalDifference, 0);
  });

  test('summiert sich über mehrere Spiele', () => {
    const results = [
      makeResult(teamA, teamB, 3, 0),
      makeResult(teamA, teamB, 1, 2),
    ];
    const standings = calculateStandings(results);
    const a = standings.find(e => e.team.name === 'Team A')!;
    assert.equal(a.goalsFor, 4);
    assert.equal(a.goalsAgainst, 2);
    assert.equal(a.goalDifference, 2);
  });
});

describe('Sortierung der Tabelle', () => {
  test('sortiert zuerst nach Punkten (absteigend)', () => {
    const results = [
      makeResult(teamA, teamB, 1, 0),
      makeResult(teamA, teamC, 1, 0),
    ];
    const standings = calculateStandings(results);
    assert.equal(standings[0].team.name, 'Team A');
    assert.equal(standings[0].points, 6);
  });

  test('bei gleichen Punkten: Tordifferenz entscheidet', () => {
    const results = [
      makeResult(teamA, teamC, 1, 0),
      makeResult(teamB, teamC, 3, 0),
    ];
    const standings = calculateStandings(results);
    assert.equal(standings[0].team.name, 'Team B');
    assert.equal(standings[1].team.name, 'Team A');
  });

  test('bei gleichen Punkten und gleicher Tordifferenz: Tore entscheiden', () => {
    const results = [
      makeResult(teamA, teamC, 2, 1),
      makeResult(teamB, teamC, 3, 2),
    ];
    const standings = calculateStandings(results);
    assert.equal(standings[0].team.name, 'Team B');
    assert.equal(standings[1].team.name, 'Team A');
  });

  test('bei vollständigem Gleichstand: alphabetisch sortiert', () => {
    const results = [
      makeResult(teamB, teamC, 1, 0),
      makeResult(teamA, teamC, 1, 0),
    ];
    const standings = calculateStandings(results);
    assert.equal(standings[0].team.name, 'Team A');
    assert.equal(standings[1].team.name, 'Team B');
  });

  test('leere Resultate ergeben leere Tabelle', () => {
    const standings = calculateStandings([]);
    assert.equal(standings.length, 0);
  });
});
