import type { Command } from "commander";
import { callCopilot } from "../api.js";
import { printResponse } from "../format.js";

export function registerCompare(program: Command): void {
  program
    .command("compare <nca1> <nca2>")
    .description("Compare reporting requirements between two NCAs")
    .action(async (nca1: string, nca2: string) => {
      try {
        const reply = await callCopilot(
          `Compare ${nca1.toUpperCase()} vs ${nca2.toUpperCase()} reporting requirements`
        );
        printResponse(
          `NCA Comparison: ${nca1.toUpperCase()} vs ${nca2.toUpperCase()}`,
          reply
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error: ${msg}`);
        process.exit(1);
      }
    });
}
