import React from "react";
import { motion } from "framer-motion";
import { X, Settings, Zap, Brain } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";

const DevTools: React.FC = () => {
  const {
    agents,
    buildings,
    events,
    time,
    toggleDevTools,
    updateAgentThought,
    addEvent,
  } = useSimulationStore();

  const injectRandomEvent = () => {
    const eventTypes = ["interaction", "thought", "goal_completed"] as const;
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const randomType =
      eventTypes[Math.floor(Math.random() * eventTypes.length)];

    const event = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: randomType,
      agentId: randomAgent.id,
      agentName: randomAgent.name,
      location: randomAgent.currentLocation,
      description: `Random ${randomType} event for ${randomAgent.name}`,
      importance: "low" as const,
    };

    addEvent(event);
  };

  const updateRandomAgentThought = () => {
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const thoughts = [
      "I wonder what's happening today...",
      "Should I visit the cafe?",
      "I need to finish my current task.",
      "What a beautiful day!",
      "I hope I meet someone interesting.",
    ];
    const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
    updateAgentThought(randomAgent.id, randomThought);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-4 left-4 w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-large border border-border-light/50 overflow-hidden z-50"
    >
      {}
      <div className="p-4 border-b border-border-light/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">
              Developer Tools
            </h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDevTools}
            className="p-1 rounded-lg hover:bg-soft-gray transition-colors"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </motion.button>
        </div>
      </div>

      {}
      <div className="p-4 space-y-4">
        {}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-primary">
            Simulation Stats
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-soft-gray p-2 rounded">
              <div className="text-text-secondary">Agents</div>
              <div className="font-medium">{agents.length}</div>
            </div>
            <div className="bg-soft-gray p-2 rounded">
              <div className="text-text-secondary">Buildings</div>
              <div className="font-medium">{buildings.length}</div>
            </div>
            <div className="bg-soft-gray p-2 rounded">
              <div className="text-text-secondary">Events</div>
              <div className="font-medium">{events.length}</div>
            </div>
            <div className="bg-soft-gray p-2 rounded">
              <div className="text-text-secondary">Day</div>
              <div className="font-medium">{time.day}</div>
            </div>
          </div>
        </div>

        {}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-primary">
            Quick Actions
          </h4>
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={injectRandomEvent}
              className="w-full p-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Inject Random Event
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={updateRandomAgentThought}
              className="w-full p-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Brain className="w-4 h-4 inline mr-2" />
              Update Random Thought
            </motion.button>
          </div>
        </div>

        {}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-primary">
            Agent Status
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between text-xs bg-soft-gray p-2 rounded"
              >
                <div className="flex items-center space-x-2">
                  <span>{agent.avatar}</span>
                  <span className="font-medium">{agent.name}</span>
                </div>
                <div className="text-text-secondary">
                  {agent.energy}% • {agent.currentLocation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-primary">
            Time Information
          </h4>
          <div className="bg-soft-gray p-3 rounded text-xs space-y-1">
            <div className="flex justify-between">
              <span>Current Time:</span>
              <span className="font-mono">
                {time.currentTime.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Speed:</span>
              <span className="font-mono">{time.speed}</span>
            </div>
            <div className="flex justify-between">
              <span>Day:</span>
              <span className="font-mono">{time.day}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DevTools;
