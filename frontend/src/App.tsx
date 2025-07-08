import { useEffect, useState } from "react";

// Type definitions
type Agent = {
  id: string;
  name: string;
  role: string;
  personality: string;
  backstory: string;
  location: string;
  memory: Memory[];
};

type Memory = {
  timestamp: string;
  type: string;
  content: string;
};

type AgentMemoryMap = {
  [agentId: string]: Memory[];
};

function App() {
  const [message, setMessage] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<AgentMemoryMap>({});

  const loadMemory = async (agentId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/memory/${agentId}`
      );
      const data: Memory[] = await response.json();
      setSelectedMemory((prev) => ({ ...prev, [agentId]: data }));
    } catch (error) {
      console.error("Failed to load memory:", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3500/api/agents")
      .then((res) => res.json())
      .then(setAgents)
      .catch((err) => console.error("Failed to fetch agents:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3500")
      .then((res) => res.text())
      .then(setMessage)
      .catch((err) => console.error("Failed to fetch message:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">🧠 AI Town — Agent Memories</h1>
      <p className="mb-8 text-lg text-gray-300">{message}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold">{agent.name}</h2>
            <p className="text-sm text-gray-400 italic">{agent.role}</p>
            <p className="mt-2">{agent.backstory}</p>
            <p className="text-sm text-purple-300 mt-1">
              Location: {agent.location}
            </p>

            {/* View Memory Button */}
            <button
              className="mt-4 bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
              onClick={() => loadMemory(agent.id)}
            >
              View Memory
            </button>

            {/* Dropdown for Talking to Another Agent */}
            <select
              className="mt-4 w-full bg-gray-700 text-white p-2 rounded"
              onChange={(e) => {
                const targetId = e.target.value;
                if (!targetId) return;
                const content = prompt(
                  `What should ${agent.name} say to ${
                    agents.find((a) => a.id === targetId)?.name
                  }?`
                );
                if (content) {
                  fetch("http://localhost:3000/api/conversation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      fromId: agent.id,
                      toId: targetId,
                      content,
                    }),
                  })
                    .then((res) => res.json())
                    .then(() => loadMemory(agent.id))
                    .catch((err) =>
                      console.error("Failed to send message:", err)
                    );
                }
              }}
            >
              <option value="">💬 Talk to another agent...</option>
              {agents
                .filter((a) => a.id !== agent.id)
                .map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.name}
                  </option>
                ))}
            </select>

            {/* Memory Display */}
            {selectedMemory[agent.id]?.length > 0 && (
              <div className="mt-4 bg-gray-700 p-4 rounded">
                <h3 className="text-lg font-bold mb-2">Memory Log:</h3>
                <ul className="list-disc ml-6 space-y-1">
                  {selectedMemory[agent.id].map((mem, idx) => (
                    <li key={idx} className="text-sm text-gray-200">
                      <span className="text-green-400">
                        [{new Date(mem.timestamp).toLocaleString()}]
                      </span>{" "}
                      – {mem.content}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
