import React from "react";
import { motion } from "framer-motion";
import { X, Brain, Clock } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";
import {
  getMemoryIcon,
  getEmotionalImpactColor,
  formatRelativeTime,
} from "../utils";

const MemoryViewer: React.FC = () => {
  const { selectedAgentId, agents, toggleMemoryViewer } = useSimulationStore();
  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);

  if (!selectedAgent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-4 right-4 w-96 bg-white/95 backdrop-blur-sm rounded-2xl shadow-large border border-border-light/50 overflow-hidden z-50"
      >
        <div className="p-4 border-b border-border-light/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">
                Memory Viewer
              </h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMemoryViewer}
              className="p-1 rounded-lg hover:bg-soft-gray transition-colors"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </motion.button>
          </div>
        </div>
        <div className="p-4 text-center text-text-secondary">
          Select an agent to view their memories
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-4 right-4 w-96 bg-white/95 backdrop-blur-sm rounded-2xl shadow-large border border-border-light/50 overflow-hidden z-50"
    >
      {}
      <div className="p-4 border-b border-border-light/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Memory Viewer
              </h3>
              <div className="text-sm text-text-secondary">
                {selectedAgent.name}'s memories
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMemoryViewer}
            className="p-1 rounded-lg hover:bg-soft-gray transition-colors"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </motion.button>
        </div>
      </div>

      {}
      <div className="h-96 overflow-y-auto p-4 space-y-3">
        {selectedAgent.memories.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            <div className="text-4xl mb-2">🧠</div>
            <div className="text-sm">No memories yet</div>
            <div className="text-xs">
              Memories will form as {selectedAgent.name} experiences events
            </div>
          </div>
        ) : (
          selectedAgent.memories.map((memory) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="memory-item"
            >
              <div className="flex items-start space-x-3">
                <div className="text-lg">{getMemoryIcon(memory.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-text-primary capitalize">
                      {memory.type}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-text-secondary">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(memory.timestamp)}</span>
                    </div>
                  </div>

                  <div className="text-sm text-text-secondary mb-2">
                    {memory.content}
                  </div>

                  <div className="flex items-center justify-between">
                    {memory.location && (
                      <div className="text-xs text-text-secondary">
                        📍 {memory.location}
                      </div>
                    )}
                    <div
                      className={`text-xs font-medium ${getEmotionalImpactColor(
                        memory.emotionalImpact
                      )}`}
                    >
                      {memory.emotionalImpact >= 0 ? "+" : ""}
                      {Math.round(memory.emotionalImpact * 100)}% impact
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default MemoryViewer;
