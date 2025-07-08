import type { Agent } from "../types/agent";
import { AgentAvatar } from "./AgentAvatar";

interface ZoneProps {
  name: string;
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
}

export function Zone({ name, agents, onAgentClick }: ZoneProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center min-h-[140px]">
      <h3 className="text-lg font-bold mb-2 text-blue-300">{name}</h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {agents.length === 0 ? (
          <span className="text-gray-500 text-xs">(empty)</span>
        ) : (
          agents.map((agent) => (
            <div
              key={agent.id}
              className="transition-all duration-500 ease-in-out transform hover:scale-110 opacity-100 animate-fadein"
            >
              <AgentAvatar
                agent={agent}
                onClick={onAgentClick ? () => onAgentClick(agent) : undefined}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
