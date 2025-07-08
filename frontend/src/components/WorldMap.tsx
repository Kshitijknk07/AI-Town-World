import type { Agent } from "../types/agent";
import { Zone } from "./Zone";

const ZONES = ["Park", "Gallery", "Library", "Cafe", "Plaza", "Workshop"];

interface WorldMapProps {
  agents: Agent[];
  selectedAgentId?: string | null;
  onAgentClick?: (agent: Agent) => void;
}

export function WorldMap({
  agents,
  selectedAgentId,
  onAgentClick,
}: WorldMapProps) {
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
    <div className="mb-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🗺️ AI Town Map</h2>
      <div className="bg-green-50 border border-green-200 rounded-3xl p-8 shadow-lg flex flex-col items-center">
        <div className="grid grid-cols-2 grid-rows-3 gap-8">
          {ZONES.map((zone) => (
            <Zone
              key={zone}
              name={zone}
              agents={agentsByZone[zone]}
              selectedAgentId={selectedAgentId}
              onAgentClick={onAgentClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
