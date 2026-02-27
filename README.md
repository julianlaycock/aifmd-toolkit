# 🛡️ aifmd-toolkit

**The open-source CLI for AIFMD II compliance.**

[![npm version](https://img.shields.io/npm/v/aifmd-toolkit)](https://www.npmjs.com/package/aifmd-toolkit)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![CI](https://github.com/caelith-tech/aifmd-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/caelith-tech/aifmd-toolkit/actions)
[![Node](https://img.shields.io/node/v/aifmd-toolkit)](https://nodejs.org)

Sanctions screening · LEI lookup · Filing deadlines · NCA profiles · Annex IV validation — all from your terminal. Zero config. Powered by the [Caelith API](https://www.caelith.tech/api/docs).

---

## ⚡ Quick Start

No install needed — just run:

```bash
npx aifmd-toolkit screen "Vladimir Putin"
```

Or install globally:

```bash
npm install -g aifmd-toolkit
```

---

## 📋 Commands

### `screen <names...>` — Sanctions Screening

Screen individuals or entities against global sanctions lists (EU, UN, OFAC, UK).

```bash
npx aifmd-toolkit screen "Vladimir Putin"
npx aifmd-toolkit screen "Acme Holdings Ltd"
```

```
  Sanctions Screening: Vladimir Putin

  Found 3 matches across EU, UN, and OFAC sanctions lists.
  ⚠ MATCH: Vladimir Vladimirovich Putin — EU Regulation 269/2014
  ⚠ MATCH: PUTIN, Vladimir — OFAC SDN List
  ⚠ MATCH: Putin, Vladimir V. — UN Security Council

  Powered by Caelith API — https://www.caelith.tech/api/docs
```

### `lei <code_or_name>` — LEI Lookup

Look up Legal Entity Identifiers by LEI code or entity name.

```bash
npx aifmd-toolkit lei "BlackRock"
npx aifmd-toolkit lei 549300B56MD0ZC402L06
```

```
  LEI Lookup: BlackRock

  Entity:     BlackRock, Inc.
  LEI:        549300FHB56AYG2MXR64
  Status:     ISSUED
  Jurisdiction: US-DE
  Registered: 2012-06-06

  Powered by Caelith API — https://www.caelith.tech/api/docs
```

### `deadlines [--country <code>]` — Filing Deadlines

Check when your next Annex IV filing is due. Optionally filter by country.

```bash
npx aifmd-toolkit deadlines
npx aifmd-toolkit deadlines --country LU
```

```
  Filing Deadlines (LU)

  Next Annex IV filing due: 2025-01-31
  Frequency: Semi-annual (for AIFMs managing >€1bn AuM)
  NCA: CSSF (Luxembourg)
  Portal: https://reporting.cssf.lu

  Powered by Caelith API — https://www.caelith.tech/api/docs
```

### `nca <code>` — NCA Profile & Quirks

Get the profile and Annex IV reporting quirks for any National Competent Authority.

```bash
npx aifmd-toolkit nca DE
npx aifmd-toolkit nca LU
```

```
  NCA Profile: DE

  Authority:  BaFin (Bundesanstalt für Finanzdienstleistungsaufsicht)
  Country:    Germany
  Portal:     MVP Portal (https://mvp.bafin.de)

  Quirks:
  • Requires German-language field descriptions in certain templates
  • Strict LEI validation — rejects expired LEIs
  • Additional national reporting fields beyond standard Annex IV
  • Filing window opens 15 days before deadline

  Powered by Caelith API — https://www.caelith.tech/api/docs
```

### `validate <file.xml>` — Validate Annex IV XML (Offline)

Validate your Annex IV XML file against ESMA structure rules — entirely offline, no API call needed.

```bash
npx aifmd-toolkit validate ./report.xml
```

```
  Annex IV Validation: ./report.xml

  ✔ All checks passed — no issues found

  Powered by Caelith API — https://www.caelith.tech/api/docs
```

With errors:

```
  Annex IV Validation: ./bad-report.xml

  ✖ Invalid PredominantAIFType: "ABCD" — expected one of: HFND, PEQF, REST, FOFS, OTHR, NONE
  ✖ Invalid LEI length (15 chars): "549300B56MD0ZC4" — expected 20
  ⚠ LEI checksum invalid: "549300B56MD0ZC402L99" — verify manually
  ✖ Invalid ReportingMemberState: "XX" — expected valid EU/EEA country code

  3 error(s), 1 warning(s)

  Powered by Caelith API — https://www.caelith.tech/api/docs
```

**Checks performed:**
- Required elements: `<AIFReportingInfo>`, `<AIFRecordInfo>`, `<AIFCompleteDescription>`
- Valid `PredominantAIFType` values (HFND, PEQF, REST, FOFS, OTHR, NONE)
- LEI format (20 characters) and ISO 17442 checksum validation
- `ReportingMemberState` is a valid EU/EEA country code

### `compare <nca1> <nca2>` — Compare Two NCAs

Side-by-side comparison of reporting requirements between two National Competent Authorities.

```bash
npx aifmd-toolkit compare DE LU
npx aifmd-toolkit compare IE FR
```

```
  NCA Comparison: DE vs LU

  Both NCAs require standard ESMA Annex IV reporting, but differ in:

  | Aspect              | BaFin (DE)            | CSSF (LU)             |
  |---------------------|-----------------------|-----------------------|
  | Portal              | MVP Portal            | CSSF Reporting Portal |
  | Language            | German required       | English accepted      |
  | Extra fields        | Yes (national annex)  | Minimal               |
  | LEI strictness      | Rejects expired LEIs  | Warns only            |
  | Filing window       | 15 days before        | 30 days before        |

  Powered by Caelith API — https://www.caelith.tech/api/docs
```

---

## 🤔 Why This Tool?

**AIFMD II is coming.** The revised Alternative Investment Fund Managers Directive enters into force in 2026, bringing significant changes to Annex IV reporting, delegation rules, and liquidity management.

Fund managers, compliance teams, and service providers need fast access to:
- **Sanctions screening** before onboarding investors
- **LEI lookups** for regulatory filings
- **NCA-specific quirks** that catch you off guard at deadline time
- **XML validation** before submitting to your NCA portal
- **Deadline tracking** across jurisdictions

`aifmd-toolkit` puts all of this in your terminal — free, open-source, zero config.

---

## 🔗 Resources

- **Caelith Platform**: [www.caelith.tech](https://www.caelith.tech) — Full AIFMD II compliance dashboard
- **API Documentation**: [www.caelith.tech/api/docs](https://www.caelith.tech/api/docs) — Explore the Caelith API
- **Compliance Copilot**: [www.caelith.tech/copilot](https://www.caelith.tech/copilot) — AI-powered compliance assistant

---

## 🛠️ Development

```bash
git clone https://github.com/caelith-tech/aifmd-toolkit.git
cd aifmd-toolkit
npm install
npm run build
npm test
```

### Run locally without building:

```bash
npx ts-node src/cli.ts screen "Test Name"
```

---

## 📄 License

Apache-2.0 — see [LICENSE](./LICENSE).

Built with ❤️ by [Caelith](https://www.caelith.tech).
