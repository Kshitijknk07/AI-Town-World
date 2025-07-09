import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentAvatar } from "./AgentAvatar";

const mockAgent = {
  id: "agent-1",
  name: "Test Agent",
  role: "citizen",
  backstory: "Just a test agent",
  currentLocation: "zone-1",
  color: "#000000",
  status: "idle" as const,
};

describe("AgentAvatar", () => {
  it("renders agent avatar with tooltip", () => {
    render(
      <TooltipProvider>
        <AgentAvatar agent={mockAgent} showTooltip />
      </TooltipProvider>
    );
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});
