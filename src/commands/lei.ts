import type { Command } from "commander";
import { callCopilot } from "../api.js";
import { printResponse } from "../format.js";

export function registerLei(program: Command): void {
  program
    .command("lei <code_or_name>")
    .description("Look up a Legal Entity Identifier (LEI)")
    .action(async (input: string) => {
      try {
        const reply = await callCopilot(`Look up LEI for ${input}`);
        printResponse(`LEI Lookup: ${input}`, reply);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error: ${msg}`);
        process.exit(1);
      }
    });
}
