import React from "react";
import { motion } from "framer-motion";
import { X, MapPin, Target, Brain } from "lucide-react";
import { Agent } from "../types";
import { useSimulationStore } from "../store/simulationStore";
import { getMoodEmoji, getEnergyColor } from "../utils";

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { setSelectedAgent } = useSimulationStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-large border border-border-light/50 overflow-hidden"
    >
      {}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-lavender-accent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="agent-avatar text-xl">{agent.avatar}</div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                {agent.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <span>{getMoodEmoji(agent.mood)}</span>
                <span>•</span>
                <span className={getEnergyColor(agent.energy)}>
                  {agent.energy}% energy
                </span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedAgent(null)}
            className="p-1 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </motion.button>
        </div>
      </div>

      {}
      <div className="p-4 space-y-3">
        {}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-text-primary">
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </div>
          <div className="text-sm text-text-secondary bg-soft-gray px-3 py-2 rounded-lg">
            {agent.currentLocation}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-text-primary">
            <Target className="w-4 h-4" />
            <span>Current Goal</span>
          </div>
          <div className="text-sm text-text-secondary bg-soft-gray px-3 py-2 rounded-lg">
            {agent.currentGoal}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-text-primary">
            <Brain className="w-4 h-4" />
            <span>Thinking</span>
          </div>
          <div className="text-sm text-text-secondary bg-soft-gray px-3 py-2 rounded-lg italic">
            "{agent.currentThought}"
          </div>
        </div>

        {}
        <div className="space-y-2">
          <div className="text-sm font-medium text-text-primary">
            Personality
          </div>
          <div className="flex flex-wrap gap-1">
            {agent.personality.traits.slice(0, 3).map((trait, index) => (
              <span
                key={index}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                {trait}
              </span>
            ))}
            {agent.personality.traits.length > 3 && (
              <span className="text-xs text-text-secondary px-2 py-1">
                +{agent.personality.traits.length - 3} more
              </span>
            )}
          </div>
        </div>

        {}
        <div className="flex items-center justify-between pt-2 border-t border-border-light/30">
          <div className="text-xs text-text-secondary">
            {agent.memories.length} memories
          </div>
          <div className="text-xs text-text-secondary">
            {Object.keys(agent.relationships).length} relationships
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentCard;
