import type { Command } from "commander";
import { readFileSync } from "node:fs";
import chalk from "chalk";
import { heading, error, warn, success, FOOTER } from "../format.js";

const VALID_AIF_TYPES = new Set(["HFND", "PEQF", "REST", "FOFS", "VCAP", "INFR", "COMF", "OTHR", "NONE"]);

const EU_COUNTRY_CODES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA
  "IS", "LI", "NO",
  // UK (legacy)
  "GB",
]);

interface ValidationIssue {
  level: "error" | "warning";
  message: string;
}

/**
 * Validate LEI checksum using ISO 17442 (mod 97-10).
 */
export function validateLEI(lei: string): boolean {
  if (lei.length !== 20) return false;
  if (!/^[A-Z0-9]+$/.test(lei)) return false;

  // Convert letters to digits (A=10, B=11, ...)
  const numeric = lei
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      return code >= 65 ? (code - 55).toString() : c;
    })
    .join("");

  // Mod 97 check
  let remainder = 0;
  for (const ch of numeric) {
    remainder = (remainder * 10 + parseInt(ch, 10)) % 97;
  }
  return remainder === 1;
}

function getTagContent(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "gi");
  const matches: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(xml)) !== null) {
    matches.push(m[1]!.trim());
  }
  return matches;
}

function hasTag(xml: string, tag: string): boolean {
  return new RegExp(`<${tag}[\\s>]`, "i").test(xml);
}

export function validateXml(xmlContent: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Required top-level elements
  const requiredElements = [
    "AIFReportingInfo",
    "AIFRecordInfo",
    "AIFCompleteDescription",
  ];

  for (const el of requiredElements) {
    if (!hasTag(xmlContent, el)) {
      issues.push({ level: "error", message: `Missing required element: <${el}>` });
    }
  }

  // Validate PredominantAIFType
  const aifTypes = getTagContent(xmlContent, "PredominantAIFType");
  for (const t of aifTypes) {
    if (!VALID_AIF_TYPES.has(t)) {
      issues.push({
        level: "error",
        message: `Invalid PredominantAIFType: "${t}" — expected one of: ${[...VALID_AIF_TYPES].join(", ")}`,
      });
    }
  }
  if (aifTypes.length === 0 && hasTag(xmlContent, "AIFRecordInfo")) {
    issues.push({
      level: "warning",
      message: "No <PredominantAIFType> found in AIFRecordInfo",
    });
  }

  // Validate LEIs
  const leis = getTagContent(xmlContent, "AIFMNationalCode");
  const leis2 = getTagContent(xmlContent, "AIFNationalCode");
  for (const lei of [...leis, ...leis2]) {
    if (lei.length !== 20) {
      issues.push({
        level: "error",
        message: `Invalid LEI length (${lei.length} chars): "${lei}" — expected 20`,
      });
    } else if (!validateLEI(lei)) {
      issues.push({
        level: "warning",
        message: `LEI checksum invalid: "${lei}" — verify manually`,
      });
    }
  }

  // Validate ReportingMemberState
  const states = getTagContent(xmlContent, "ReportingMemberState");
  for (const s of states) {
    if (s.length !== 2 || !EU_COUNTRY_CODES.has(s.toUpperCase())) {
      issues.push({
        level: "error",
        message: `Invalid ReportingMemberState: "${s}" — expected valid EU/EEA country code`,
      });
    }
  }
  if (states.length === 0) {
    issues.push({
      level: "warning",
      message: "No <ReportingMemberState> found",
    });
  }

  return issues;
}

export function registerValidate(program: Command): void {
  program
    .command("validate <file>")
    .description("Validate an Annex IV XML file against ESMA structure rules (offline)")
    .action((file: string) => {
      let xml: string;
      try {
        xml = readFileSync(file, "utf-8");
      } catch {
        console.error(chalk.red(`  ✖ Cannot read file: ${file}`));
        process.exit(1);
      }

      console.log(heading(`Annex IV Validation: ${file}`));

      const issues = validateXml(xml);
      const errors = issues.filter((i) => i.level === "error");
      const warnings = issues.filter((i) => i.level === "warning");

      if (issues.length === 0) {
        console.log(success("All checks passed — no issues found"));
      } else {
        for (const e of errors) console.log(error(e.message));
        for (const w of warnings) console.log(warn(w.message));
        console.log("");
        console.log(
          `  ${chalk.red.bold(`${errors.length} error(s)`)}, ${chalk.yellow.bold(`${warnings.length} warning(s)`)}`
        );
      }

      console.log(FOOTER);
      if (errors.length > 0) process.exit(1);
    });
}
