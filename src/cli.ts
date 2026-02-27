#!/usr/bin/env node

import { Command } from "commander";
import { registerScreen } from "./commands/screen.js";
import { registerLei } from "./commands/lei.js";
import { registerDeadlines } from "./commands/deadlines.js";
import { registerNca } from "./commands/nca.js";
import { registerValidate } from "./commands/validate.js";
import { registerCompare } from "./commands/compare.js";

const program = new Command();

program
  .name("aifmd-toolkit")
  .version("1.0.0")
  .description(
    "Open-source CLI for AIFMD II compliance — sanctions screening, LEI lookup, NCA profiles, Annex IV validation, and more."
  );

registerScreen(program);
registerLei(program);
registerDeadlines(program);
registerNca(program);
registerValidate(program);
registerCompare(program);

program.parse();
