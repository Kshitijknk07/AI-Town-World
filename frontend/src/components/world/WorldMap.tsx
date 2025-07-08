import React from "react";
import { Agent, Zone } from "@/types/agent";
import { ZoneTile } from "./ZoneTile";
import { MiniMapLegend } from "./MiniMapLegend";

interface WorldMapProps {
  zones: Zone[];
  agents: Agent[];
  selectedAgentId?: string;
  onAgentSelect: (agentId: string) => void;
  onAgentMove: (agentId: string, targetZoneId: string) => void;
  isMoving: boolean;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  zones,
  agents,
  selectedAgentId,
  onAgentSelect,
  onAgentMove,
  isMoving,
}) => {
  // Calculate grid dimensions
  const maxX = Math.max(...zones.map((z) => z.x));
  const maxY = Math.max(...zones.map((z) => z.y));

  // Create a 2D grid
  const grid = Array(maxY + 1)
    .fill(null)
    .map(() => Array(maxX + 1).fill(null));
  zones.forEach((zone) => {
    grid[zone.y][zone.x] = zone;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Main Map */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Agent Town Visualization
          </h2>

          <div
            className="grid gap-3 justify-center"
            style={{
              gridTemplateColumns: `repeat(${maxX + 1}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${maxY + 1}, minmax(0, 1fr))`,
            }}
          >
            {grid.flat().map((zone, index) => {
              if (!zone) return <div key={index} className="w-32 h-32" />;

              const zoneAgents = agents.filter((agent) =>
                zone.agentIds.includes(agent.id)
              );

              return (
                <ZoneTile
                  key={zone.id}
                  zone={zone}
                  agents={zoneAgents}
                  selectedAgentId={selectedAgentId}
                  allAgents={agents}
                  onAgentSelect={onAgentSelect}
                  onAgentMove={onAgentMove}
                  isMoving={isMoving}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Mini Map Legend */}
      <MiniMapLegend zones={zones} agents={agents} />
    </div>
  );
};
