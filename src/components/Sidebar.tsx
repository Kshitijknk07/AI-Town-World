import React from "react";
import { motion } from "framer-motion";
import { Users, MapPin } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";
import { getMoodEmoji, getEnergyColor } from "../utils";

const Sidebar: React.FC = () => {
  const { agents, selectedAgentId, setSelectedAgent } = useSimulationStore();

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-white/90 backdrop-blur-sm border-r border-border-light/50 flex flex-col"
    >
      {}
      <div className="p-4 border-b border-border-light/50">
        <div className="flex items-center space-x-2 text-text-primary">
          <Users className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Agents</h2>
          <span className="ml-auto text-sm text-text-secondary bg-soft-gray px-2 py-1 rounded-full">
            {agents.length}
          </span>
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedAgent(agent.id)}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedAgentId === agent.id
                ? "bg-primary/10 border-2 border-primary/30 shadow-medium"
                : "bg-soft-gray hover:bg-lavender-accent border-2 border-transparent"
            }`}
          >
            <div className="flex items-center space-x-3">
              {}
              <div className="relative">
                <div className="agent-avatar text-lg">{agent.avatar}</div>
                <div className="absolute -bottom-1 -right-1 text-sm">
                  {getMoodEmoji(agent.mood)}
                </div>
              </div>

              {}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-text-primary truncate">
                    {agent.name}
                  </h3>
                  <div
                    className={`text-xs font-medium ${getEnergyColor(
                      agent.energy
                    )}`}
                  >
                    {agent.energy}%
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs text-text-secondary mt-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{agent.currentLocation}</span>
                </div>

                <div className="text-xs text-text-secondary mt-1 truncate">
                  {agent.currentThought}
                </div>
              </div>
            </div>

            {}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-light/30">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {agent.personality.traits.slice(0, 2).map((trait, index) => (
                    <span
                      key={index}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-text-secondary">
                {agent.memories.length} memories
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {}
      <div className="p-4 border-t border-border-light/50">
        <div className="text-xs text-text-secondary text-center">
          Click on an agent to view details
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
