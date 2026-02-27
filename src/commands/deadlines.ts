import type { Command } from "commander";
import { callCopilot } from "../api.js";
import { printResponse } from "../format.js";

export function registerDeadlines(program: Command): void {
  program
    .command("deadlines")
    .description("Check AIFMD Annex IV filing deadlines")
    .option("-c, --country <code>", "Filter by country NCA (e.g., DE, LU, IE)")
    .action(async (opts: { country?: string }) => {
      try {
        const message = opts.country
          ? `When is my next Annex IV filing due with ${opts.country}'s NCA?`
          : "When is my next Annex IV filing due?";
        const reply = await callCopilot(message);
        const title = opts.country
          ? `Filing Deadlines (${opts.country.toUpperCase()})`
          : "Filing Deadlines";
        printResponse(title, reply);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error: ${msg}`);
        process.exit(1);
      }
    });
}
