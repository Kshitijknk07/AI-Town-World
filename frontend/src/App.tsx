import { useAgents } from "./hooks/useAgents";
import { useMessage } from "./hooks/useMessage";
import { useAgentMemory } from "./hooks/useAgentMemory";
import { AgentCard } from "./components/AgentCard";
import { WorldMap } from "./components/WorldMap";
import { useRef, useState, useEffect } from "react";

function App() {
  const { agents, reloadAgents } = useAgents();
  const { message } = useMessage();
  const { selectedMemory, loadMemory } = useAgentMemory();
  const [highlightedAgentId, setHighlightedAgentId] = useState<string | null>(
    null
  );
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  // Scroll to highlighted card when set
  useEffect(() => {
    if (highlightedAgentId && cardRefs.current[highlightedAgentId]) {
      cardRefs.current[highlightedAgentId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedAgentId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">🧠 AI Town — Agent Memories</h1>
      <p className="mb-8 text-lg text-gray-300">{message}</p>

      {/* World Map Visualization */}
      <WorldMap
        agents={agents}
        onAgentClick={(agent) => {
          setHighlightedAgentId(agent.id);
          loadMemory(agent.id);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            ref={(el) => {
              cardRefs.current[agent.id] = el;
            }}
          >
            <AgentCard
              agent={agent}
              agents={agents}
              memories={selectedMemory[agent.id] || []}
              onViewMemory={() => loadMemory(agent.id)}
              onTalk={handleTalk(agent.id)}
              onMove={handleMove(agent.id)}
              highlighted={highlightedAgentId === agent.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
