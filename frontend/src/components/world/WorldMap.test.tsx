import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { WorldMap } from "./WorldMap";

const mockZone = {
  id: "zone-1",
  name: "Test Zone",
  description: "A test zone",
  type: "residential" as const,
  x: 0,
  y: 0,
  capacity: 10,
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

describe("WorldMap", () => {
  it("renders without crashing", () => {
    render(
      <TooltipProvider>
        <WorldMap
          zones={[mockZone]}
          agents={[mockAgent]}
          onAgentSelect={() => {}}
          onAgentMove={() => {}}
          isMoving={false}
        />
      </TooltipProvider>
    );
    expect(screen.getByTestId("world-map")).toBeInTheDocument();
  });
});
