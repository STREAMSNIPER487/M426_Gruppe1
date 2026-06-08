export interface Team {
  name: string;
}

export class TeamManager {
  private teams: Team[] = [];

  addTeam(name: string): void {
    const trimmed = name.trim();
    if (trimmed === "") {
      throw new Error("Teamname darf nicht leer sein.");
    }
    this.teams.push({ name: trimmed });
  }

  getTeams(): Team[] {
    return [...this.teams];
  }
}
