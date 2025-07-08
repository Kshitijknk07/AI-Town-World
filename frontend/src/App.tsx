import { useAgents } from "./hooks/useAgents";
import { useMessage } from "./hooks/useMessage";
import { useAgentMemory } from "./hooks/useAgentMemory";
import { WorldMap } from "./components/WorldMap";
import { AgentMemory } from "./components/AgentMemory";
import { useState } from "react";

function App() {
  const { agents, reloadAgents } = useAgents();
  const { message } = useMessage();
  const { selectedMemory, loadMemory } = useAgentMemory();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showMemory, setShowMemory] = useState(false);

  // Handler for talking to another agent
  const handleTalk =
    (fromId: string) => async (toId: string, content: string) => {
      await fetch("http://localhost:3500/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromId, toId, content }),
      });
      loadMemory(fromId);
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
    <div className="min-h-screen bg-green-100 text-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        🧠 AI Town — Agent Memories
      </h1>
      <p className="mb-8 text-lg text-gray-700 text-center">{message}</p>

      {/* World Map Visualization */}
      <WorldMap
        agents={agents}
        selectedAgentId={selectedAgentId}
        onAgentClick={handleAgentClick}
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
    </div>
  );
}

export default App;
