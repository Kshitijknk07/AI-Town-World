import { useAgents } from "./hooks/useAgents";
import { useMessage } from "./hooks/useMessage";
import { useAgentMemory } from "./hooks/useAgentMemory";
import { AgentCard } from "./components/AgentCard";

function App() {
  const { agents, reloadAgents } = useAgents();
  const { message } = useMessage();
  const { selectedMemory, loadMemory } = useAgentMemory();

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">🧠 AI Town — Agent Memories</h1>
      <p className="mb-8 text-lg text-gray-300">{message}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            agents={agents}
            memories={selectedMemory[agent.id] || []}
            onViewMemory={() => loadMemory(agent.id)}
            onTalk={handleTalk(agent.id)}
            onMove={handleMove(agent.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
