import type { Agent, Memory } from "../types/agent";
import { AgentMemory } from "./AgentMemory";
import { AgentTalkDropdown } from "./AgentTalkDropdown";
import { AgentMoveDropdown } from "./AgentMoveDropdown";

interface AgentCardProps {
  agent: Agent;
  agents: Agent[];
  memories: Memory[];
  onViewMemory: () => void;
  onTalk: (toId: string, content: string) => void;
  onMove: (newLocation: string) => void;
}

export function AgentCard({
  agent,
  agents,
  memories,
  onViewMemory,
  onTalk,
  onMove,
}: AgentCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold">{agent.name}</h2>
      <p className="text-sm text-gray-400 italic">{agent.role}</p>
      <p className="mt-2">{agent.backstory}</p>
      <p className="text-sm text-purple-300 mt-1">Location: {agent.location}</p>

      {/* Move Dropdown */}
      <AgentMoveDropdown agentId={agent.id} onMove={onMove} />

      {/* View Memory Button */}
      <button
        className="mt-4 bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
        onClick={onViewMemory}
      >
        View Memory
      </button>

      {/* Dropdown for Talking to Another Agent */}
      <AgentTalkDropdown agent={agent} agents={agents} onTalk={onTalk} />

      {/* Memory Display */}
      <AgentMemory memories={memories} />
    </div>
  );
}
