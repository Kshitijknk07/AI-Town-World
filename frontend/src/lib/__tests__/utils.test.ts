import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("handles conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});
