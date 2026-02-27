import type { Command } from "commander";
import { callCopilot } from "../api.js";
import { printResponse } from "../format.js";

export function registerNca(program: Command): void {
  program
    .command("nca <code>")
    .description("Get NCA profile and Annex IV reporting quirks")
    .action(async (code: string) => {
      try {
        const reply = await callCopilot(
          `What are ${code.toUpperCase()}'s Annex IV quirks?`
        );
        printResponse(`NCA Profile: ${code.toUpperCase()}`, reply);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error: ${msg}`);
        process.exit(1);
      }
    });
}
