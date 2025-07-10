import React, { useState } from "react";
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
    addAgent,
    fetchAgents,
  } = useSimulationStore();

  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentAvatar, setNewAgentAvatar] = useState("👤");
  const [newAgentPersonality, setNewAgentPersonality] = useState("");

  const handleAddAgent = async () => {
    if (!newAgentName.trim() || !buildings || buildings.length === 0) return;
    await addAgent({
      name: newAgentName,
      avatar: newAgentAvatar,
      personality: {
        traits: newAgentPersonality
          ? newAgentPersonality.split(",").map((t) => t.trim())
          : [],
        goals: [],
        fears: [],
        interests: [],
      },
      currentLocation: buildings[0]?.id || "default_location",
      currentGoal: "Explore the town",
    });
    setNewAgentName("");
    setNewAgentAvatar("👤");
    setNewAgentPersonality("");
    fetchAgents();
  };

  const injectRandomEvent = () => {
    if (!agents || agents.length === 0) return;
    const eventTypes = ["interaction", "thought", "goal_completed"] as const;
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    if (!randomAgent) return;
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
    if (!agents || agents.length === 0) return;
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    if (!randomAgent) return;
    updateAgentThought(
      randomAgent.id,
      `Random thought at ${new Date().toLocaleTimeString()}`
    );
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
            {[
              { label: "Agents", value: agents ? agents.length : 0 },
              { label: "Buildings", value: buildings ? buildings.length : 0 },
              { label: "Events", value: events ? events.length : 0 },
              { label: "Day", value: time.day },
            ].map((stat, idx) => (
              <div className="bg-soft-gray p-2 rounded" key={stat.label + idx}>
                <div className="text-text-secondary">{stat.label}</div>
                <div className="font-medium">{stat.value}</div>
              </div>
            ))}
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

            {}
            <div className="space-y-2 bg-soft-gray p-3 rounded-lg mt-4">
              <div className="text-xs font-semibold text-text-primary mb-1">
                Add New Agent
              </div>
              <input
                type="text"
                placeholder="Name"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="w-full px-2 py-1 border border-border-light rounded mb-1 text-sm"
              />
              <input
                type="text"
                placeholder="Avatar (emoji)"
                value={newAgentAvatar}
                onChange={(e) => setNewAgentAvatar(e.target.value)}
                className="w-full px-2 py-1 border border-border-light rounded mb-1 text-sm"
              />
              <input
                type="text"
                placeholder="Personality traits (comma separated)"
                value={newAgentPersonality}
                onChange={(e) => setNewAgentPersonality(e.target.value)}
                className="w-full px-2 py-1 border border-border-light rounded mb-2 text-sm"
              />
              <button
                onClick={handleAddAgent}
                className="w-full p-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                disabled={!newAgentName.trim()}
              >
                Add Agent
              </button>
            </div>
          </div>
        </div>

        {}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-primary">
            Agent Status
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {agents?.map((agent) => (
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
