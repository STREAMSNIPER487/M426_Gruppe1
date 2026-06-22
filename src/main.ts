import * as readline from "readline";
import { TeamManager } from "./teams";

const manager = new TeamManager();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu(): void {
  console.log("\n Fussball-Liga-Simulator");
  console.log("1) Mannschaft hinzufügen");
  console.log("2) Mannschaftsliste anzeigen");
  console.log("0) Beenden");
  rl.question("Auswahl: ", handleInput);
}

function handleInput(input: string): void {
  const choice = input.trim();

  if (choice === "1") {
    rl.question("Mannschaftsname: ", (name: string) => {
      try {
        manager.addTeam(name);
        console.log(`Mannschaft "${name.trim()}" wurde hinzugefügt.`);
      } catch (e: unknown) {
        console.error("Fehler:", (e as Error).message);
      }
      showMenu();
    });
  } else if (choice === "2") {
    const teams = manager.getTeams();
    if (teams.length === 0) {
      console.log("Keine Mannschaften erfasst.");
    } else {
      console.log("\nMannschaftsliste:");
      teams.forEach((t, i) => console.log(`  ${i + 1}. ${t.name}`));
    }
    showMenu();
  } else if (choice === "0") {
    console.log("Auf Wiedersehen!");
    rl.close();
  } else {
    console.log("Ungültige Auswahl.");
    showMenu();
  }
}

export function checkIfEven(num: number): boolean {
    if (num % 2 === 0) {
        return true;
    } else {
        throw new Error("Number is not even");
    }
}

showMenu();
