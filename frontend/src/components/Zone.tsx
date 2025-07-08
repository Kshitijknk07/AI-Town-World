import type { Agent } from "../types/agent";
import { AgentAvatar } from "./AgentAvatar";

const ZONE_EMOJIS: Record<string, string> = {
  Park: "🌳",
  Gallery: "🖼️",
  Library: "📚",
  Cafe: "☕",
  Plaza: "🏛️",
  Workshop: "🛠️",
};

interface ZoneProps {
  name: string;
  agents: Agent[];
  selectedAgentId?: string | null;
  onAgentClick?: (agent: Agent) => void;
}

export function Zone({ name, agents, selectedAgentId, onAgentClick }: ZoneProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-md flex flex-col items-center min-h-[160px] px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{ZONE_EMOJIS[name] || "❓"}</span>
        <span className="font-bold text-gray-700 text-lg">{name}</span>
      </div>
      <div className="flex flex-wrap gap-3 justify-center w-full">
        {agents.length === 0 ? (
          <span className="text-gray-400 text-xs">(empty)</span>
        ) : (
          agents.map((agent) => (
            <AgentAvatar
              key={agent.id}
              agent={agent}
              selected={selectedAgentId === agent.id}
              onClick={onAgentClick ? () => onAgentClick(agent) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
