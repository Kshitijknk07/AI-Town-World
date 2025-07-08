import type { Agent } from "../types/agent";
import { Zone } from "./Zone";

const ZONES = ["Park", "Gallery", "Library", "Cafe", "Plaza", "Workshop"];

interface WorldMapProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
}

export function WorldMap({ agents, onAgentClick }: WorldMapProps) {
  // Group agents by location
  const agentsByZone: Record<string, Agent[]> = {};
  ZONES.forEach((zone) => {
    agentsByZone[zone] = [];
  });
  agents.forEach((agent) => {
    if (ZONES.includes(agent.location)) {
      agentsByZone[agent.location].push(agent);
    }
  });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-200">World Map</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ZONES.map((zone) => (
          <Zone
            key={zone}
            name={zone}
            agents={agentsByZone[zone]}
            onAgentClick={onAgentClick}
          />
        ))}
      </div>
    </div>
  );
}
