import type { Memory } from "../types/agent";

interface AgentMemoryProps {
  memories: Memory[];
}

export function AgentMemory({ memories }: AgentMemoryProps) {
  if (!memories || memories.length === 0) return null;
  return (
    <div className="mt-4 bg-gray-700 p-4 rounded">
      <h3 className="text-lg font-bold mb-2">Memory Log:</h3>
      <ul className="list-disc ml-6 space-y-1">
        {memories.map((mem, idx) => (
          <li key={idx} className="text-sm text-gray-200">
            <span className="text-green-400">
              [{new Date(mem.timestamp).toLocaleString()}]
            </span>{" "}
            – {mem.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
