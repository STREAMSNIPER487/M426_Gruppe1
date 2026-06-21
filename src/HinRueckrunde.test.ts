import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createHinUndRueckrunde } from './HinRueckrunde.ts';

describe('createHinUndRueckrunde', () => {
  test('erzeugt keine Begegnungen bei weniger als 2 Teams', () => {
    assert.equal(createHinUndRueckrunde([]).length, 0);
    assert.equal(createHinUndRueckrunde([1]).length, 0);
  });

  test('erzeugt für 2 Teams genau ein Heim- und ein Auswärtsspiel', () => {
    const begegnungen = createHinUndRueckrunde([1, 2]);
    assert.equal(begegnungen.length, 2);
    assert.ok(begegnungen.some(([heim, auswaerts]) => heim === 1 && auswaerts === 2));
    assert.ok(begegnungen.some(([heim, auswaerts]) => heim === 2 && auswaerts === 1));
  });

  test('jedes Team spielt einmal zuhause und einmal auswärts gegen jeden Gegner', () => {
    const teams = [1, 2, 3, 4];
    const begegnungen = createHinUndRueckrunde(teams);

    for (const heim of teams) {
      for (const auswaerts of teams) {
        if (heim === auswaerts) continue;
        const treffer = begegnungen.filter(([h, a]) => h === heim && a === auswaerts);
        assert.equal(treffer.length, 1, `${heim} zuhause gegen ${auswaerts} sollte genau 1x vorkommen`);
      }
    }
  });

  test('keine Begegnung fehlt: Anzahl Spiele entspricht n * (n - 1)', () => {
    const teams = [1, 2, 3, 4];
    const begegnungen = createHinUndRueckrunde(teams);
    assert.equal(begegnungen.length, teams.length * (teams.length - 1));
  });

  test('jede Begegnung aus der Hinrunde kommt in der Rückrunde mit getauschten Rollen vor', () => {
    const teams = [1, 2, 3];
    const begegnungen = createHinUndRueckrunde(teams);
    const hinrunde = begegnungen.slice(0, 3);
    for (const [heim, auswaerts] of hinrunde) {
      assert.ok(begegnungen.some(([h, a]) => h === auswaerts && a === heim));
    }
  });
});
