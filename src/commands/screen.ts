import type { Command } from "commander";
import { callCopilot } from "../api.js";
import { printResponse } from "../format.js";

export function registerScreen(program: Command): void {
  program
    .command("screen <names...>")
    .description("Screen names against global sanctions lists")
    .action(async (names: string[]) => {
      const query = names.join(" ");
      try {
        const reply = await callCopilot(`Screen ${query}`);
        printResponse(`Sanctions Screening: ${query}`, reply);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error: ${msg}`);
        process.exit(1);
      }
    });
}
