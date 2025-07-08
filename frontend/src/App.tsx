import { useAgents } from "./hooks/useAgents";
import { useMessage } from "./hooks/useMessage";
import { useAgentMemory } from "./hooks/useAgentMemory";
import { WorldMap } from "./components/WorldMap";
import { AgentMemory } from "./components/AgentMemory";
import { useState } from "react";
import { motion } from "framer-motion";

interface ConversationEvent {
  fromId: string;
  toId: string;
  timestamp: number;
}

function App() {
  const { agents, reloadAgents } = useAgents();
  const { message } = useMessage();
  const { selectedMemory, loadMemory } = useAgentMemory();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [lastConversation, setLastConversation] =
    useState<ConversationEvent | null>(null);

  // Handler for talking to another agent
  const handleTalk =
    (fromId: string) => async (toId: string, content: string) => {
      await fetch("http://localhost:3500/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromId, toId, content }),
      });
      loadMemory(fromId);
      setLastConversation({ fromId, toId, timestamp: Date.now() });
      setTimeout(() => setLastConversation(null), 1800);
    };

  // Handler for moving an agent
  const handleMove = (agentId: string) => async (newLocation: string) => {
    await fetch(`http://localhost:3500/api/move/${agentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: newLocation }),
    });
    reloadAgents();
    loadMemory(agentId);
  };

  // When an agent is clicked in the map, show their memory
  const handleAgentClick = (agent: any) => {
    if (selectedAgentId === agent.id) {
      setShowMemory(false);
      setSelectedAgentId(null);
    } else {
      setSelectedAgentId(agent.id);
      loadMemory(agent.id);
      setShowMemory(true);
    }
  };

  // Close memory modal on click-away
  const handleCloseMemory = () => {
    setShowMemory(false);
    setSelectedAgentId(null);
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-50 px-2 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h1
        className="text-4xl font-extrabold mb-6 text-center drop-shadow-lg tracking-wide text-blue-900"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        🧠 AI Town — Agent Memories
      </motion.h1>
      <motion.p
        className="mb-8 text-lg text-gray-700 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        {message}
      </motion.p>

      {/* World Map Visualization */}
      <WorldMap
        agents={agents}
        selectedAgentId={selectedAgentId}
        onAgentClick={handleAgentClick}
        lastConversation={lastConversation}
      />

      {/* Floating Agent Memory Panel */}
      <AgentMemory
        open={showMemory && !!selectedAgent}
        onClose={handleCloseMemory}
        agentName={selectedAgent?.name || ""}
        agentId={selectedAgent?.id || ""}
        memories={selectedMemory[selectedAgentId || ""] || []}
        agents={agents}
        onTalk={handleTalk(selectedAgentId || "")}
        onMove={handleMove(selectedAgentId || "")}
      />
    </motion.div>
  );
}

export default App;
