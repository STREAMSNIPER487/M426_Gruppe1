import { createSpielPlan } from './SpielPlan.ts';

export type Begegnung = [number, number];

export function createHinUndRueckrunde(teams: number[]): Begegnung[] {
  const hinrunde = createSpielPlan(teams);
  const rueckrunde: Begegnung[] = hinrunde.map(([heim, auswaerts]) => [auswaerts, heim]);
  return [...hinrunde, ...rueckrunde];
}
