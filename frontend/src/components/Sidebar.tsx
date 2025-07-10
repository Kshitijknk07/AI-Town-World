import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, MapPin } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";
import { getMoodEmoji, getEnergyColor } from "../utils";

const Sidebar: React.FC = () => {
  const {
    agents,
    selectedAgentId,
    setSelectedAgent,
    updateAgent,
    deleteAgent,
    fetchAgents,
  } = useSimulationStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editPersonality, setEditPersonality] = useState("");

  const startEdit = (agent: any) => {
    setEditingId(agent.id);
    setEditName(agent.name);
    setEditAvatar(agent.avatar);
    setEditPersonality(agent.personality.traits.join(", "));
  };

  const handleEditSave = async (agent: any) => {
    await updateAgent(agent.id, {
      name: editName,
      avatar: editAvatar,
      personality: {
        ...agent.personality,
        traits: editPersonality.split(",").map((t: string) => t.trim()),
      },
    });
    setEditingId(null);
    fetchAgents();
  };

  const handleDelete = async (id: string) => {
    await deleteAgent(id);
    fetchAgents();
  };

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
        {agents.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            <div className="text-4xl mb-2">🧑‍🤝‍🧑</div>
            <div className="text-sm">
              No agents yet. Add one using DevTools!
            </div>
          </div>
        ) : (
          agents.map((agent) =>
            editingId === agent.id ? (
              <div
                key={agent.id}
                className="space-y-1 bg-soft-gray p-2 rounded"
              >
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-2 py-1 border border-border-light rounded text-sm mb-1"
                />
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-2 py-1 border border-border-light rounded text-sm mb-1"
                />
                <input
                  type="text"
                  value={editPersonality}
                  onChange={(e) => setEditPersonality(e.target.value)}
                  className="w-full px-2 py-1 border border-border-light rounded text-sm mb-1"
                  placeholder="Personality traits (comma separated)"
                />
                <div className="flex space-x-2 mt-1">
                  <button
                    onClick={() => handleEditSave(agent)}
                    className="flex-1 p-1 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 p-1 bg-soft-gray text-text-secondary rounded text-xs font-medium border border-border-light"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
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
                    <button
                      onClick={() => startEdit(agent)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-xs text-text-secondary">
                    {agent.memories.length} memories
                  </div>
                </div>
              </motion.div>
            )
          )
        )}
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
