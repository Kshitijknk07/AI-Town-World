import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ZoneTile } from "./ZoneTile";

const mockZone = {
  id: "zone-1",
  name: "Test Zone",
  description: "A test zone",
  type: "residential" as const,
  x: 0,
  y: 0,
  capacity: 2,
  agentIds: ["agent-1"],
};
const mockAgent = {
  id: "agent-1",
  name: "Test Agent",
  role: "citizen",
  backstory: "Just a test agent",
  currentLocation: "zone-1",
  color: "#000000",
  status: "idle" as const,
};

describe("ZoneTile", () => {
  it("renders with zone and agent", () => {
    render(
      <TooltipProvider>
        <ZoneTile
          zone={mockZone}
          agents={[mockAgent]}
          selectedAgentId={undefined}
          allAgents={[mockAgent]}
          onAgentSelect={vi.fn()}
          onAgentMove={vi.fn()}
          isMoving={false}
        />
      </TooltipProvider>
    );
    expect(screen.getByText("Test Zone")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });
});
