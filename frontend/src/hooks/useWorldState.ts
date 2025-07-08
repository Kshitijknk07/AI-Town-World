import { useState, useCallback, useEffect } from "react";
import { Agent, Zone, Memory, WorldState } from "@/types/agent";

// Static list of possible zones (since backend does not provide /api/zones)
const staticZones: Omit<Zone, "agentIds">[] = [
  {
    id: "bookstore",
    name: "Bookstore",
    description: "A cozy bookstore",
    type: "commercial",
    x: 1,
    y: 1,
    capacity: 3,
  },
  {
    id: "town-hall",
    name: "Town Hall",
    description: "Administrative center",
    type: "civic",
    x: 2,
    y: 1,
    capacity: 5,
  },
  {
    id: "park",
    name: "Central Park",
    description: "Green space for relaxation",
    type: "park",
    x: 0,
    y: 2,
    capacity: 6,
  },
  {
    id: "cafe",
    name: "Town Café",
    description: "Popular meeting spot",
    type: "commercial",
    x: 1,
    y: 2,
    capacity: 4,
  },
  {
    id: "library",
    name: "Library",
    description: "Quiet study space",
    type: "civic",
    x: 2,
    y: 2,
    capacity: 8,
  },
  {
    id: "market",
    name: "Market Square",
    description: "Bustling marketplace",
    type: "commercial",
    x: 0,
    y: 0,
    capacity: 10,
  },
  {
    id: "residential-1",
    name: "Oak Street",
    description: "Quiet residential area",
    type: "residential",
    x: 0,
    y: 1,
    capacity: 2,
  },
  {
    id: "residential-2",
    name: "Maple Avenue",
    description: "Family neighborhood",
    type: "residential",
    x: 2,
    y: 0,
    capacity: 2,
  },
  {
    id: "school",
    name: "Elementary School",
    description: "Local school",
    type: "civic",
    x: 1,
    y: 0,
    capacity: 15,
  },
];

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

  // Helper to build zones from agents' current locations
  const buildZones = (agents: Agent[]): Zone[] => {
    console.log("Building zones with agents:", agents);

    const zones = staticZones.map((zone) => ({
      ...zone,
      agentIds: agents
        .filter((a) => a.currentLocation === zone.id)
        .map((a) => a.id),
    }));

    console.log("Built zones:", zones);
    return zones;
  };

  // Fetch agents from backend
  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/agents");
      if (!res.ok) {
        throw new Error(`Failed to fetch agents: ${res.status}`);
      }
      const backendAgents = await res.json();
      console.log("Fetched agents from backend:", backendAgents);

      const agents: Agent[] = backendAgents.map(
        (backendAgent: any, index: number) => ({
          id: backendAgent.id,
          name: backendAgent.name,
          role: backendAgent.role,
          backstory: backendAgent.backstory,
          currentLocation: backendAgent.location, // Map 'location' to 'currentLocation'
          color: `hsl(${index * 120}, 70%, 50%)`, // Generate colors for agents
          status: "idle" as const,
        })
      );

      console.log("Transformed agents:", agents);

      // Ensure agents have valid data
      const validAgents = agents.filter(
        (agent) => agent && agent.id && agent.name && agent.currentLocation
      );

      console.log("Valid agents:", validAgents);

      setWorldState((prev) => ({
        ...prev,
        agents: validAgents,
        zones: buildZones(validAgents),
      }));
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      // Set empty state on error
      setWorldState((prev) => ({
        ...prev,
        agents: [],
        zones: buildZones([]),
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        // Update agents and zones from backend response
        await fetchAgents();
        setTimeout(() => {
          setWorldState((prev) => ({ ...prev, isMoving: false }));
        }, 500); // mimic animation delay
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
