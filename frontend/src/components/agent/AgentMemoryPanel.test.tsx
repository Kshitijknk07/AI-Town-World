import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentMemoryPanel } from "./AgentMemoryPanel";

const mockAgent = {
  id: "agent-1",
  name: "Test Agent",
  role: "citizen",
  backstory: "Just a test agent",
  currentLocation: "zone-1",
  color: "#000000",
  status: "idle" as const,
};
const mockMemories = [
  {
    id: "mem-1",
    agentId: "agent-1",
    type: "observation" as const,
    content: "Saw something interesting",
    timestamp: new Date(),
    location: "zone-1",
    importance: 5,
  },
];

describe("AgentMemoryPanel", () => {
  it("renders with agent and memories", () => {
    render(
      <TooltipProvider>
        <AgentMemoryPanel
          agent={mockAgent}
          memories={mockMemories}
          isOpen={true}
          isLoading={false}
          onClose={() => {}}
          onFetchMemories={() => {}}
          agents={[mockAgent]}
        />
      </TooltipProvider>
    );
    expect(screen.getByText("Test Agent")).toBeInTheDocument();
    expect(screen.getByText("Saw something interesting")).toBeInTheDocument();
  });
});
