"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamManager = void 0;
class TeamManager {
    constructor() {
        this.teams = [];
    }
    addTeam(name) {
        const trimmed = name.trim();
        if (trimmed === "") {
            throw new Error("Teamname darf nicht leer sein.");
        }
        this.teams.push({ name: trimmed });
    }
    getTeams() {
        return [...this.teams];
    }
}
exports.TeamManager = TeamManager;
