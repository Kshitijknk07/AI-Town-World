import type { Agent, Memory } from "../types/agent";
import { AgentMemory } from "./AgentMemory";
import { AgentTalkDropdown } from "./AgentTalkDropdown";
import { AgentMoveDropdown } from "./AgentMoveDropdown";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AgentCardProps {
  agent: Agent;
  agents: Agent[];
  memories: Memory[];
  onViewMemory: () => void;
  onTalk: (toId: string, content: string) => void;
  onMove: (newLocation: string) => void;
  highlighted?: boolean;
}

export function AgentCard({
  agent,
  agents,
  memories,
  onViewMemory,
  onTalk,
  onMove,
  highlighted = false,
}: AgentCardProps) {
  return (
    <Card
      className={`transition-all duration-500 relative shadow-lg border-2 ${
        highlighted
          ? "border-yellow-400 shadow-yellow-400/50 z-10 scale-105"
          : "border-blue-800"
      } bg-gradient-to-br from-blue-950 to-purple-900/80 rounded-2xl`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <span role="img" aria-label="agent">
            🧑‍💼
          </span>{" "}
          {agent.name}
        </CardTitle>
        <CardDescription className="italic text-blue-300">
          {agent.role}
        </CardDescription>
        <div className="text-sm text-purple-200 mt-1">
          Location: {agent.location}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-white text-sm">{agent.backstory}</div>
        <AgentMoveDropdown agentId={agent.id} onMove={onMove} />
        <AgentTalkDropdown agent={agent} agents={agents} onTalk={onTalk} />
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="secondary"
          className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
          onClick={onViewMemory}
        >
          View Memory
        </Button>
        <AgentMemory
          memories={memories}
          open={false}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
          agentName={""}
          agentId={""}
          agents={[]}
          onTalk={function (_toId: string, _content: string): void {
            throw new Error("Function not implemented.");
          }}
          onMove={function (_newLocation: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      </CardFooter>
    </Card>
  );
}
