type Spiel = [number, number];

export function createSpielPlan(teams: number[]): Spiel[] {
    const spielplan: Spiel[] = [];

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            spielplan.push([teams[i], teams[j]]);
        }
    }

    return spielplan;
}