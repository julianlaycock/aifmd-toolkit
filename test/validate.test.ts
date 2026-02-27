import { describe, it, expect } from "vitest";
import { validateXml, validateLEI } from "../src/commands/validate.js";

describe("validateLEI", () => {
  it("accepts a valid LEI", () => {
    // Bloomberg LP's LEI
    expect(validateLEI("549300B56MD0ZC402L06")).toBe(true);
  });

  it("rejects LEI with wrong length", () => {
    expect(validateLEI("549300B56MD0ZC402L0")).toBe(false);
  });

  it("rejects LEI with bad checksum", () => {
    expect(validateLEI("549300B56MD0ZC402L99")).toBe(false);
  });
});

describe("validateXml", () => {
  const validXml = `<?xml version="1.0"?>
<AIFReportingInfo>
  <AIFRecordInfo>
    <AIFMNationalCode>549300B56MD0ZC402L06</AIFMNationalCode>
    <PredominantAIFType>HFND</PredominantAIFType>
    <ReportingMemberState>DE</ReportingMemberState>
    <AIFCompleteDescription>
      <SomeContent/>
    </AIFCompleteDescription>
  </AIFRecordInfo>
</AIFReportingInfo>`;

  it("returns no issues for valid XML", () => {
    const issues = validateXml(validXml);
    expect(issues).toHaveLength(0);
  });

  it("detects missing required elements", () => {
    const xml = `<Root><Something/></Root>`;
    const issues = validateXml(xml);
    const errorMsgs = issues.filter((i) => i.level === "error").map((i) => i.message);
    expect(errorMsgs).toContain("Missing required element: <AIFReportingInfo>");
    expect(errorMsgs).toContain("Missing required element: <AIFRecordInfo>");
    expect(errorMsgs).toContain("Missing required element: <AIFCompleteDescription>");
  });

  it("detects invalid PredominantAIFType", () => {
    const xml = `<AIFReportingInfo><AIFRecordInfo>
      <PredominantAIFType>XXXX</PredominantAIFType>
      <AIFCompleteDescription/>
    </AIFRecordInfo></AIFReportingInfo>`;
    const issues = validateXml(xml);
    expect(issues.some((i) => i.message.includes('Invalid PredominantAIFType: "XXXX"'))).toBe(true);
  });

  it("detects invalid ReportingMemberState", () => {
    const xml = `<AIFReportingInfo><AIFRecordInfo>
      <ReportingMemberState>XX</ReportingMemberState>
      <AIFCompleteDescription/>
    </AIFRecordInfo></AIFReportingInfo>`;
    const issues = validateXml(xml);
    expect(issues.some((i) => i.message.includes('Invalid ReportingMemberState: "XX"'))).toBe(true);
  });

  it("warns on missing ReportingMemberState", () => {
    const xml = `<AIFReportingInfo><AIFRecordInfo>
      <PredominantAIFType>HFND</PredominantAIFType>
      <AIFCompleteDescription/>
    </AIFRecordInfo></AIFReportingInfo>`;
    const issues = validateXml(xml);
    expect(issues.some((i) => i.level === "warning" && i.message.includes("No <ReportingMemberState>"))).toBe(true);
  });

  it("detects LEI with wrong length", () => {
    const xml = `<AIFReportingInfo><AIFRecordInfo>
      <AIFMNationalCode>SHORT</AIFMNationalCode>
      <AIFCompleteDescription/>
    </AIFRecordInfo></AIFReportingInfo>`;
    const issues = validateXml(xml);
    expect(issues.some((i) => i.message.includes("Invalid LEI length"))).toBe(true);
  });
});
