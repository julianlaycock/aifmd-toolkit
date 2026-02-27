import { describe, it, expect } from "vitest";
import { heading, success, warn, error } from "../src/format.js";

describe("format helpers", () => {
  it("heading includes the text", () => {
    const h = heading("Test Title");
    expect(h).toContain("Test Title");
  });

  it("success includes checkmark", () => {
    expect(success("done")).toContain("✔");
  });

  it("warn includes warning symbol", () => {
    expect(warn("caution")).toContain("⚠");
  });

  it("error includes cross symbol", () => {
    expect(error("fail")).toContain("✖");
  });
});
