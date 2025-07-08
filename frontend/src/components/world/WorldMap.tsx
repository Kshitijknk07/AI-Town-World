import React, { useMemo } from "react";
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

export const WorldMap: React.FC<WorldMapProps> = React.memo(
  ({
    zones,
    agents,
    selectedAgentId,
    onAgentSelect,
    onAgentMove,
    isMoving,
  }) => {
    const { grid, maxX, maxY, validZones } = useMemo(() => {
      if (!zones || zones.length === 0) {
        return { grid: [], maxX: 0, maxY: 0, validZones: [] };
      }

      const validZones = zones.filter(
        (zone) =>
          typeof zone.x === "number" &&
          typeof zone.y === "number" &&
          zone.x >= 0 &&
          zone.y >= 0
      );

      if (validZones.length === 0) {
        return { grid: [], maxX: 0, maxY: 0, validZones: [] };
      }

      const maxX = Math.max(...validZones.map((z) => z.x));
      const maxY = Math.max(...validZones.map((z) => z.y));

      if (maxX > 100 || maxY > 100) {
        return { grid: [], maxX: 0, maxY: 0, validZones: [] };
      }

      const grid = Array(maxY + 1)
        .fill(null)
        .map(() => Array(maxX + 1).fill(null));

      validZones.forEach((zone) => {
        if (zone.y < grid.length && zone.x < grid[0].length) {
          grid[zone.y][zone.x] = zone;
        }
      });

      return { grid, maxX, maxY, validZones };
    }, [zones]);

    if (!zones || zones.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-500">Loading map...</span>
        </div>
      );
    }

    if (validZones.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-500">No valid zones found</span>
        </div>
      );
    }

    if (maxX > 100 || maxY > 100) {
      return (
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-500">Grid size too large</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {}
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

        {}
        <MiniMapLegend
          zones={zones}
          agents={agents}
          onAgentSelect={onAgentSelect}
          onAgentMove={onAgentMove}
        />
      </div>
    );
  }
);

WorldMap.displayName = "WorldMap";
