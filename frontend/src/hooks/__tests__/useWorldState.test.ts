import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWorldState } from "../useWorldState";

global.fetch = vi.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
) as any;

describe("useWorldState", () => {
  beforeEach(() => {
    (fetch as any).mockClear();
  });

  it("initializes with default world state", async () => {
    const { result } = renderHook(() => useWorldState());
    expect(result.current.worldState.agents).toEqual([]);
    expect(result.current.worldState.zones).toEqual([]);
    expect(result.current.worldState.selectedAgentId).toBeUndefined();
  });
});
