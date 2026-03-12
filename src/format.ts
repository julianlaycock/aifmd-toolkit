import chalk from "chalk";

export const FOOTER =
  chalk.dim("\n  Powered by Caelith API — https://www.caelith.tech/api/docs\n");

export function heading(text: string): string {
  return chalk.bold.cyan(`\n  ${text}\n`);
}

export function success(text: string): string {
  return chalk.green(`  ✔ ${text}`);
}

export function warn(text: string): string {
  return chalk.yellow(`  ⚠ ${text}`);
}

export function error(text: string): string {
  return chalk.red(`  ✖ ${text}`);
}

export function info(text: string): string {
  return chalk.white(`  ${text}`);
}

export function dim(text: string): string {
  return chalk.dim(`  ${text}`);
}

export function printResponse(title: string, body: string): void {
  console.log(heading(title));
  // Indent each line of the body
  const lines = body.split("\n").map((l) => `  ${l}`);
  console.log(lines.join("\n"));
  console.log(FOOTER);
}

