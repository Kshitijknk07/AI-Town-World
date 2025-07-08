import { useState, useCallback, useEffect } from "react";
import { Agent, Zone, Memory, WorldState } from "@/types/agent";

// Mock data for demonstration - replace with actual API calls
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Alice",
    role: "Shopkeeper",
    backstory: "Runs the local bookstore and loves recommending novels",
    currentLocation: "bookstore",
    color: "#3B82F6",
    status: "idle",
  },
  {
    id: "2",
    name: "Bob",
    role: "Mayor",
    backstory: "Town mayor who cares deeply about community welfare",
    currentLocation: "town-hall",
    color: "#EF4444",
    status: "idle",
  },
  {
    id: "3",
    name: "Carol",
    role: "Artist",
    backstory: "Local painter who finds inspiration in everyday life",
    currentLocation: "park",
    color: "#10B981",
    status: "idle",
  },
  {
    id: "4",
    name: "David",
    role: "Chef",
    backstory: "Passionate chef who runs the town café",
    currentLocation: "cafe",
    color: "#F59E0B",
    status: "idle",
  },
];

const mockZones: Zone[] = [
  {
    id: "bookstore",
    name: "Bookstore",
    description: "A cozy bookstore",
    type: "commercial",
    x: 1,
    y: 1,
    capacity: 3,
    agentIds: ["1"],
  },
  {
    id: "town-hall",
    name: "Town Hall",
    description: "Administrative center",
    type: "civic",
    x: 2,
    y: 1,
    capacity: 5,
    agentIds: ["2"],
  },
  {
    id: "park",
    name: "Central Park",
    description: "Green space for relaxation",
    type: "park",
    x: 0,
    y: 2,
    capacity: 6,
    agentIds: ["3"],
  },
  {
    id: "cafe",
    name: "Town Café",
    description: "Popular meeting spot",
    type: "commercial",
    x: 1,
    y: 2,
    capacity: 4,
    agentIds: ["4"],
  },
  {
    id: "library",
    name: "Library",
    description: "Quiet study space",
    type: "civic",
    x: 2,
    y: 2,
    capacity: 8,
    agentIds: [],
  },
  {
    id: "market",
    name: "Market Square",
    description: "Bustling marketplace",
    type: "commercial",
    x: 0,
    y: 0,
    capacity: 10,
    agentIds: [],
  },
  {
    id: "residential-1",
    name: "Oak Street",
    description: "Quiet residential area",
    type: "residential",
    x: 0,
    y: 1,
    capacity: 2,
    agentIds: [],
  },
  {
    id: "residential-2",
    name: "Maple Avenue",
    description: "Family neighborhood",
    type: "residential",
    x: 2,
    y: 0,
    capacity: 2,
    agentIds: [],
  },
  {
    id: "school",
    name: "Elementary School",
    description: "Local school",
    type: "civic",
    x: 1,
    y: 0,
    capacity: 15,
    agentIds: [],
  },
];

export const useWorldState = () => {
  const [worldState, setWorldState] = useState<WorldState>({
    agents: mockAgents,
    zones: mockZones,
    conversations: [],
    selectedAgentId: undefined,
    isMemoryPanelOpen: false,
    isMoving: false,
    isTalking: false,
  });

  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setWorldState((prev) => {
          const updatedAgents = prev.agents.map((agent) =>
            agent.id === agentId
              ? {
                  ...agent,
                  currentLocation: targetZoneId,
                  status: "moving" as const,
                }
              : agent
          );

          const updatedZones = prev.zones.map((zone) => {
            if (zone.agentIds.includes(agentId)) {
              return {
                ...zone,
                agentIds: zone.agentIds.filter((id) => id !== agentId),
              };
            }
            if (zone.id === targetZoneId) {
              return { ...zone, agentIds: [...zone.agentIds, agentId] };
            }
            return zone;
          });

          return {
            ...prev,
            agents: updatedAgents,
            zones: updatedZones,
            isMoving: false,
          };
        });

        // Update agent status back to idle after animation
        setTimeout(() => {
          setWorldState((prev) => ({
            ...prev,
            agents: prev.agents.map((agent) =>
              agent.id === agentId ? { ...agent, status: "idle" } : agent
            ),
          }));
        }, 500);
      } catch (error) {
        console.error("Failed to move agent:", error);
        setWorldState((prev) => ({ ...prev, isMoving: false }));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchAgentMemories = useCallback(
    async (agentId: string) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockMemories: Memory[] = [
          {
            id: "1",
            agentId,
            type: "observation",
            content: "I noticed the weather is particularly nice today.",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            location:
              worldState.agents.find((a) => a.id === agentId)
                ?.currentLocation || "",
            importance: 3,
          },
          {
            id: "2",
            agentId,
            type: "conversation",
            content:
              "Had an interesting chat with a visitor about local books.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            location:
              worldState.agents.find((a) => a.id === agentId)
                ?.currentLocation || "",
            importance: 7,
          },
          {
            id: "3",
            agentId,
            type: "thought",
            content: "I should reorganize the mystery section soon.",
            timestamp: new Date(Date.now() - 1000 * 60 * 90),
            location:
              worldState.agents.find((a) => a.id === agentId)
                ?.currentLocation || "",
            importance: 5,
          },
        ];

        setMemories(mockMemories);
      } catch (error) {
        console.error("Failed to fetch memories:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [worldState.agents]
  );

  const closeMemoryPanel = useCallback(() => {
    setWorldState((prev) => ({
      ...prev,
      isMemoryPanelOpen: false,
      selectedAgentId: undefined,
    }));
  }, []);

  return {
    worldState,
    memories,
    isLoading,
    selectAgent,
    moveAgent,
    fetchAgentMemories,
    closeMemoryPanel,
  };
};
