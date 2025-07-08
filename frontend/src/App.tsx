import { useEffect, useState } from "react";

// Defining the Type only for Typescript

type Agent = {
  id: string;
  name: string;
  role: string;
  personality: string;
  backstory: string;
  location: string;
  memory: any[];
};

function App() {
  const [message, setMessage] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    fetch("http://localhost:3500/api/agents")
      .then((Response) => Response.json())
      .then(setAgents);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3500")
      .then((Response) => Response.text())
      .then(setMessage);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">AI Town 🧠🏘️</h1>
      <p className="text-xl">{message}</p>

      <div className="gird grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold">{agent.name}</h2>
            <p className="text-sm text-gray-400 italic">{agent.role}</p>
            <p className="mt-2">{agent.backstory}</p>
            <p className="mt-2 text-sm text-purple-300">
              Personality: {agent.personality}
            </p>
            <p className="text-sm text-green-400">Location: {agent.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
