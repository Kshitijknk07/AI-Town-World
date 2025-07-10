import React, { useMemo } from "react";
import { Agent, Zone } from "@/types/agent";
import { ZoneTile } from "./ZoneTile";
import { MiniMapLegend } from "./MiniMapLegend";
import { motion } from "framer-motion";

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
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" />
            <span className="text-xl font-medium text-gray-600">Loading magical world...</span>
          </motion.div>
        </div>
      );
    }

    if (validZones.length === 0) {
      return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-xl font-medium text-gray-600">No valid zones found</span>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col xl:flex-row gap-8 p-6">
          {/* Main World Map */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-effect rounded-3xl shadow-2xl p-8 border border-white/30">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  AI Town World
                </h1>
                <p className="text-gray-600 text-lg">
                  Watch intelligent agents live, learn, and interact in their virtual world
                </p>
              </motion.div>

              <motion.div
                className="grid gap-6 justify-center max-w-6xl mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${maxX + 1}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${maxY + 1}, minmax(0, 1fr))`,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {grid.flat().map((zone, index) => {
                  if (!zone) return <div key={index} className="w-48 h-48" />;

                  const zoneAgents = agents.filter((agent) =>
                    zone.agentIds?.includes(agent.id) || agent.currentLocation === zone.id
                  );

                  return (
                    <motion.div
                      key={zone.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: 0.6 + (index * 0.1),
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      <ZoneTile
                        zone={zone}
                        agents={zoneAgents}
                        selectedAgentId={selectedAgentId}
                        allAgents={agents}
                        onAgentSelect={onAgentSelect}
                        onAgentMove={onAgentMove}
                        isMoving={isMoving}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="xl:w-96"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <MiniMapLegend
              zones={zones}
              agents={agents}
              onAgentSelect={onAgentSelect}
              onAgentMove={onAgentMove}
            />
          </motion.div>
        </div>
      </div>
    );
  }
);

WorldMap.displayName = "WorldMap";