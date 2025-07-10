import React from "react";
import { motion } from "framer-motion";
import { useSimulationStore } from "../store/simulationStore";
import { getAgentsAtLocation } from "../utils";

const TownMap: React.FC = () => {
  const { buildings, agents, setSelectedAgent } = useSimulationStore();

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {}
      <div className="relative z-10 p-8">
        <div className="grid grid-cols-12 gap-8 h-full">
          {buildings.map((building) => {
            const buildingAgents = getAgentsAtLocation(agents, building.id);

            return (
              <motion.div
                key={building.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: Math.random() * 0.5 }}
                className="relative"
                style={{
                  gridColumn: `${Math.floor(building.position.x / 100) + 1}`,
                  gridRow: `${Math.floor(building.position.y / 100) + 1}`,
                }}
              >
                {}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="building-tile relative group cursor-pointer"
                >
                  <div className="text-2xl">{building.icon}</div>

                  {}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-time-controls text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {building.name}
                    </div>
                  </div>
                </motion.div>

                {}
                <div className="absolute -top-2 -right-2 flex flex-wrap gap-1">
                  {buildingAgents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setSelectedAgent(agent.id)}
                      className="agent-avatar cursor-pointer shadow-medium hover:shadow-large transition-shadow"
                    >
                      {agent.avatar}
                    </motion.div>
                  ))}
                </div>

                {}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                  <div className="text-xs text-text-secondary bg-white/80 px-2 py-1 rounded-full whitespace-nowrap">
                    {building.name}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {}
      <div className="absolute inset-0 pointer-events-none">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            className="absolute"
            animate={{
              x:
                buildings.find((b) => b.id === agent.currentLocation)?.position
                  .x || 0,
              y:
                buildings.find((b) => b.id === agent.currentLocation)?.position
                  .y || 0,
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="agent-avatar text-lg cursor-pointer shadow-medium"
              onClick={() => setSelectedAgent(agent.id)}
            >
              {agent.avatar}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-medium">
        <div className="text-xs font-medium text-text-primary mb-2">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <div className="building-tile w-6 h-6 text-sm">🏠</div>
            <span>Homes</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <div className="building-tile w-6 h-6 text-sm">☕</div>
            <span>Public Spaces</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <div className="agent-avatar w-6 h-6 text-sm">👤</div>
            <span>Agents</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TownMap;
