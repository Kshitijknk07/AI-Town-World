import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Index from "./Index";

vi.mock("@/hooks/useWorldState", () => ({
  useWorldState: () => ({
    worldState: {
      agents: [
        {
          id: "agent-1",
          name: "Test Agent",
          role: "citizen",
          backstory: "Just a test agent",
          currentLocation: "zone-1",
          color: "#000000",
          status: "idle",
        },
      ],
      zones: [
        {
          id: "zone-1",
          name: "Test Zone",
          description: "A test zone",
          type: "residential",
          x: 0,
          y: 0,
          capacity: 2,
          agentIds: ["agent-1"],
        },
      ],
      selectedAgentId: "agent-1",
      selectedZoneId: "zone-1",
      isMemoryPanelOpen: true,
      isMoving: false,
      isTalking: false,
      conversations: [],
    },
    memories: [
      {
        id: "mem-1",
        agentId: "agent-1",
        type: "observation",
        content: "Saw something interesting",
        timestamp: new Date(),
        location: "zone-1",
        importance: 5,
      },
    ],
    isLoading: false,
    setWorldState: vi.fn(),
    selectAgent: vi.fn(),
    selectZone: vi.fn(),
    moveAgent: vi.fn(),
    addMemory: vi.fn(),
    fetchAgentMemories: vi.fn(),
    closeMemoryPanel: vi.fn(),
  }),
}));

describe("Index page", () => {
  it("renders WorldMap and AgentMemoryPanel", () => {
    act(() => {
      render(<Index />);
    });
    expect(screen.getAllByText("Test Zone").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Test Agent").length).toBeGreaterThan(1);
    expect(screen.getByText("Saw something interesting")).toBeInTheDocument();
  });
});
