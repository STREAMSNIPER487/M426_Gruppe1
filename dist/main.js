"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const teams_1 = require("./teams");
const manager = new teams_1.TeamManager();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function showMenu() {
    console.log("\n=== Fussball-Liga-Simulator ===");
    console.log("1) Mannschaft hinzufügen");
    console.log("2) Mannschaftsliste anzeigen");
    console.log("0) Beenden");
    rl.question("Auswahl: ", handleInput);
}
function handleInput(input) {
    const choice = input.trim();
    if (choice === "1") {
        rl.question("Mannschaftsname: ", (name) => {
            try {
                manager.addTeam(name);
                console.log(`Mannschaft "${name.trim()}" wurde hinzugefügt.`);
            }
            catch (e) {
                console.error("Fehler:", e.message);
            }
            showMenu();
        });
    }
    else if (choice === "2") {
        const teams = manager.getTeams();
        if (teams.length === 0) {
            console.log("Keine Mannschaften erfasst.");
        }
        else {
            console.log("\nMannschaftsliste:");
            teams.forEach((t, i) => console.log(`  ${i + 1}. ${t.name}`));
        }
        showMenu();
    }
    else if (choice === "0") {
        console.log("Auf Wiedersehen!");
        rl.close();
    }
    else {
        console.log("Ungültige Auswahl.");
        showMenu();
    }
}
showMenu();
