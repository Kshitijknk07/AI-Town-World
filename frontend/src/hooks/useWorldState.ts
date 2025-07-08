import { useState, useCallback, useEffect } from "react";
import { Agent, Zone, Memory, WorldState } from "@/types/agent";

export const useWorldState = () => {
  const [worldState, setWorldState] = useState<WorldState>({
    agents: [],
    zones: [],
    conversations: [],
    selectedAgentId: undefined,
    isMemoryPanelOpen: false,
    isMoving: false,
    isTalking: false,
  });

  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to build zones with agent assignments
  const buildZonesWithAgents = (zones: Zone[], agents: Agent[]): Zone[] => {
    return zones.map((zone) => ({
      ...zone,
      agentIds: agents
        .filter((a) => a.currentLocation === zone.id)
        .map((a) => a.id),
    }));
  };

  // Fetch zones from backend
  const fetchZones = useCallback(async () => {
    try {
      const res = await fetch("/api/zones");
      if (!res.ok) {
        throw new Error(`Failed to fetch zones: ${res.status}`);
      }
      const zones: Zone[] = await res.json();
      console.log("Fetched zones from backend:", zones);
      return zones;
    } catch (error) {
      console.error("Failed to fetch zones:", error);
      return [];
    }
  }, []);

  // Fetch agents from backend
  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/agents");
      if (!res.ok) {
        throw new Error(`Failed to fetch agents: ${res.status}`);
      }
      const backendAgents = await res.json();
      // Transform backend agents to match frontend interface
      const agents: Agent[] = backendAgents.map(
        (backendAgent: any, index: number) => ({
          id: backendAgent.id,
          name: backendAgent.name,
          role: backendAgent.role,
          backstory: backendAgent.backstory,
          currentLocation: backendAgent.location, // Map 'location' to 'currentLocation'
          color: `hsl(${index * 120}, 70%, 50%)`, // Generate colors for agents
          status: backendAgent.status || "idle",
        })
      );
      // Ensure agents have valid data
      const validAgents = agents.filter(
        (agent) => agent && agent.id && agent.name && agent.currentLocation
      );
      // Fetch zones and build complete state
      const zones = await fetchZones();
      const zonesWithAgents = buildZonesWithAgents(zones, validAgents);
      setWorldState((prev) => ({
        ...prev,
        agents: validAgents,
        zones: zonesWithAgents,
        // Preserve selectedAgentId and isMemoryPanelOpen
        selectedAgentId: prev.selectedAgentId,
        isMemoryPanelOpen: prev.isMemoryPanelOpen,
      }));
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      // Set empty state on error, but preserve selection
      setWorldState((prev) => ({
        ...prev,
        agents: [],
        zones: [],
        selectedAgentId: prev.selectedAgentId,
        isMemoryPanelOpen: prev.isMemoryPanelOpen,
      }));
    } finally {
      setIsLoading(false);
    }
  }, [fetchZones]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const selectAgent = useCallback((agentId: string | undefined) => {
    setWorldState((prev) => ({
      ...prev,
      selectedAgentId: agentId,
      isMemoryPanelOpen: !!agentId,
    }));
  }, []);

  const moveAgent = useCallback(
    async (agentId: string, targetZoneId: string) => {
      setIsLoading(true);
      setWorldState((prev) => ({ ...prev, isMoving: true }));
      try {
        const res = await fetch(`/api/move/${agentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: targetZoneId }),
        });
        if (!res.ok) throw new Error("Failed to move agent");
        const data = await res.json();

        // Immediately update the agent status to "moving"
        setWorldState((prev) => ({
          ...prev,
          agents: prev.agents.map((agent) =>
            agent.id === agentId
              ? { ...agent, status: "moving" as const }
              : agent
          ),
        }));

        // Refresh agents after a short delay to get updated status
        setTimeout(async () => {
          await fetchAgents();
          setWorldState((prev) => ({ ...prev, isMoving: false }));
        }, 1000); // Match backend timeout

        return data;
      } catch (error) {
        console.error("Failed to move agent:", error);
        setWorldState((prev) => ({ ...prev, isMoving: false }));
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAgents]
  );

  // Add real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Only refresh if we have agents and not currently loading
      if (worldState.agents.length > 0 && !isLoading) {
        fetchAgents();
      }
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [worldState.agents.length, isLoading, fetchAgents]);

  const fetchAgentMemories = useCallback(async (agentId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/memory/${agentId}`);
      if (!res.ok) throw new Error("Failed to fetch memories");
      const memoriesRaw = await res.json();
      // Backend does not provide id, location, importance, so we must adapt
      const memories: Memory[] = (memoriesRaw as any[]).map((m, idx) => ({
        id: String(idx + 1),
        agentId,
        type: m.type || "observation",
        content: m.content || "",
        timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
        location: m.location || "",
        importance: m.importance || 5,
      }));
      setMemories(memories);
    } catch (error) {
      console.error("Failed to fetch memories:", error);
      setMemories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeMemoryPanel = useCallback(() => {
    setWorldState((prev) => ({
      ...prev,
      isMemoryPanelOpen: false,
      selectedAgentId: undefined,
    }));
  }, []);

  // Add a new memory to an agent
  const addAgentMemory = useCallback(
    async (agentId: string, memory: { type: string; content: string }) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/memory/${agentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memory),
        });
        if (!res.ok) throw new Error("Failed to add memory");
        await fetchAgentMemories(agentId); // Refresh memories
      } catch (error) {
        console.error("Failed to add memory:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAgentMemories]
  );

  // Record a conversation between two agents
  const recordConversation = useCallback(
    async (fromId: string, toId: string, content: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/conversation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fromId, toId, content }),
        });
        if (!res.ok) throw new Error("Failed to record conversation");
        // Optionally refresh memories for both agents
        await Promise.all([
          fetchAgentMemories(fromId),
          fetchAgentMemories(toId),
        ]);
      } catch (error) {
        console.error("Failed to record conversation:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAgentMemories]
  );

  return {
    worldState,
    memories,
    isLoading,
    selectAgent,
    moveAgent,
    fetchAgentMemories,
    closeMemoryPanel,
    addAgentMemory,
    recordConversation,
  };
};
