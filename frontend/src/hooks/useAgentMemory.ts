import { useState } from "react";
import type { AgentMemoryMap, Memory } from "../types/agent";

export function useAgentMemory() {
  const [selectedMemory, setSelectedMemory] = useState<AgentMemoryMap>({});
  const [loading, setLoading] = useState<string | null>(null); // agentId or null
  const [error, setError] = useState<string | null>(null);

  const loadMemory = async (agentId: string) => {
    setLoading(agentId);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3500/api/memory/${agentId}`
      );
      const data: Memory[] = await response.json();
      setSelectedMemory((prev) => ({ ...prev, [agentId]: data }));
    } catch (err) {
      setError("Failed to load memory");
    } finally {
      setLoading(null);
    }
  };

  return { selectedMemory, loadMemory, loading, error };
}
