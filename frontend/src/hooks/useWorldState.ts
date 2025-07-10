import { useState, useCallback, useEffect, useRef } from "react";
import { Agent, Zone, Memory, WorldState } from "@/types/agent";

const API_BASE_URL = "/api";

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

  const isUserInteracting = useRef(false);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMemoryUpdate = useRef<number>(0);
  const memoryPanelOpenRef = useRef<boolean>(false);

  const buildZonesWithAgents = (zones: Zone[], agents: Agent[]): Zone[] => {
    return zones.map((zone) => ({
      ...zone,
      agentIds: agents
        .filter((a) => a.currentLocation === zone.id)
        .map((a) => a.id),
    }));
  };

  const fetchZones = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/zones`);
      if (!res.ok) {
        throw new Error(`Failed to fetch zones: ${res.status}`);
      }
      const zones: Zone[] = await res.json();
      return zones;
    } catch (error) {
      console.error("Failed to fetch zones:", error);
      return [];
    }
  }, []);

  const fetchAgents = useCallback(
    async (preserveSelection = true) => {
      if (isUserInteracting.current || memoryPanelOpenRef.current) {
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/agents`);
        if (!res.ok) {
          throw new Error(`Failed to fetch agents: ${res.status}`);
        }
        const backendAgents = await res.json();
        
        const agentColors = [
          "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", 
          "#3B82F6", "#8B5A2B", "#EC4899", "#6366F1", "#14B8A6"
        ];
        
        const agents: Agent[] = backendAgents.map(
          (backendAgent: any, index: number) => ({
            id: backendAgent.id,
            name: backendAgent.name,
            role: backendAgent.role,
            backstory: backendAgent.backstory,
            currentLocation: backendAgent.location,
            color: agentColors[index % agentColors.length],
            status: backendAgent.status || "idle",
          })
        );
        
        const validAgents = agents.filter(
          (agent) => agent && agent.id && agent.name && agent.currentLocation
        );
        
        const zones = await fetchZones();
        const zonesWithAgents = buildZonesWithAgents(zones, validAgents);

        setWorldState((prev) => {
          const agentsChanged =
            JSON.stringify(prev.agents) !== JSON.stringify(validAgents);
          const zonesChanged =
            JSON.stringify(prev.zones) !== JSON.stringify(zonesWithAgents);

          if (!agentsChanged && !zonesChanged) {
            return prev;
          }

          return {
            ...prev,
            agents: validAgents,
            zones: zonesWithAgents,
            selectedAgentId: preserveSelection
              ? prev.selectedAgentId
              : prev.selectedAgentId,
            isMemoryPanelOpen: preserveSelection
              ? prev.isMemoryPanelOpen
              : prev.isMemoryPanelOpen,
          };
        });
      } catch (error) {
        console.error("Failed to fetch agents:", error);
        setWorldState((prev) => ({
          ...prev,
          agents: [],
          zones: [],
          selectedAgentId: preserveSelection
            ? prev.selectedAgentId
            : prev.selectedAgentId,
          isMemoryPanelOpen: preserveSelection
            ? prev.isMemoryPanelOpen
            : prev.isMemoryPanelOpen,
        }));
      }
    },
    [fetchZones]
  );

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const selectAgent = useCallback((agentId: string | undefined) => {
    isUserInteracting.current = true;
    memoryPanelOpenRef.current = !!agentId;

    setWorldState((prev) => ({
      ...prev,
      selectedAgentId: agentId,
      isMemoryPanelOpen: !!agentId,
    }));

    setTimeout(() => {
      isUserInteracting.current = false;
    }, 3000);
  }, []);

  const moveAgent = useCallback(
    async (agentId: string, targetZoneId: string) => {
      isUserInteracting.current = true;

      setIsLoading(true);
      setWorldState((prev) => ({ ...prev, isMoving: true }));
      
      try {
        const res = await fetch(`${API_BASE_URL}/move/${agentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: targetZoneId }),
        });
        
        if (!res.ok) throw new Error("Failed to move agent");
        
        setWorldState((prev) => ({
          ...prev,
          agents: prev.agents.map((agent) =>
            agent.id === agentId
              ? { ...agent, status: "moving" as const }
              : agent
          ),
        }));

        setTimeout(async () => {
          await fetchAgents(false);
          setWorldState((prev) => ({ ...prev, isMoving: false }));
          isUserInteracting.current = false;
        }, 1500);

      } catch (error) {
        console.error("Failed to move agent:", error);
        setWorldState((prev) => ({ ...prev, isMoving: false }));
        isUserInteracting.current = false;
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAgents]
  );

  useEffect(() => {
    const startPolling = () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }

      pollingTimeoutRef.current = setTimeout(() => {
        if (
          worldState.agents.length > 0 &&
          !isLoading &&
          !isUserInteracting.current &&
          !memoryPanelOpenRef.current
        ) {
          fetchAgents();
        }
        startPolling();
      }, 10000);
    };

    startPolling();

    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [worldState.agents.length, isLoading, fetchAgents]);

  const fetchAgentMemories = useCallback(async (agentId: string) => {
    isUserInteracting.current = true;
    memoryPanelOpenRef.current = true;

    const now = Date.now();
    if (now - lastMemoryUpdate.current < 2000) {
      return;
    }
    lastMemoryUpdate.current = now;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/memory/${agentId}`);
      if (!res.ok) throw new Error("Failed to fetch memories");
      const memoriesRaw = await res.json();
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
    isUserInteracting.current = true;
    memoryPanelOpenRef.current = false;

    setWorldState((prev) => ({
      ...prev,
      isMemoryPanelOpen: false,
      selectedAgentId: undefined,
    }));

    setTimeout(() => {
      isUserInteracting.current = false;
    }, 2000);
  }, []);

  const addAgentMemory = useCallback(
    async (agentId: string, memory: { type: string; content: string }) => {
      isUserInteracting.current = true;
      memoryPanelOpenRef.current = true;

      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/memory/${agentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memory),
        });
        if (!res.ok) throw new Error("Failed to add memory");
        await fetchAgentMemories(agentId);
      } catch (error) {
        console.error("Failed to add memory:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAgentMemories]
  );

  const recordConversation = useCallback(
    async (fromId: string, toId: string, content: string) => {
      isUserInteracting.current = true;
      memoryPanelOpenRef.current = true;

      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/conversation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fromId, toId, content }),
        });
        if (!res.ok) throw new Error("Failed to record conversation");
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