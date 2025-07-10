import { create } from "zustand";
import {
  SimulationState,
  Agent,
  Event,
  ChatMessage,
  SimulationTime,
  Memory,
} from "../types";

export const useSimulationStore = create<SimulationState>((set) => ({
  isRunning: true,
  time: {
    currentTime: new Date(),
    speed: "normal",
    day: 1,
    hour: 10,
    minute: 30,
  },
  agents: [],
  buildings: [],
  events: [],
  selectedAgentId: null,
  chatMessages: {},
  ui: {
    showMemoryViewer: false,
    showDevTools: false,
    activeTab: "events",
  },

  fetchAgents: async (): Promise<void> => {
    const res = await fetch("/api/agents");
    const agents = await res.json();
    set({ agents });
  },
  addAgent: async (agentData: Partial<Agent>): Promise<void> => {
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agentData),
    });
    const agent = await res.json();
    set((state) => ({ agents: [...state.agents, agent] }));
  },
  updateAgent: async (id: string, updates: Partial<Agent>): Promise<void> => {
    await fetch(`/api/agents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  },
  deleteAgent: async (id: string): Promise<void> => {
    await fetch(`/api/agents/${id}`, { method: "DELETE" });
    set((state) => ({ agents: state.agents.filter((a) => a.id !== id) }));
  },

  setSelectedAgent: (agentId) => {
    set((state) => ({
      agents: state.agents.map((agent) => ({
        ...agent,
        isSelected: agent.id === agentId,
      })),
      selectedAgentId: agentId,
    }));
  },

  updateAgentLocation: (agentId: string, newLocation: string) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId
          ? { ...agent, currentLocation: newLocation }
          : agent
      ),
      buildings: state.buildings.map((building) => ({
        ...building,
        currentOccupants: building.currentOccupants
          .filter((id) => id !== agentId)
          .concat(building.id === newLocation ? [agentId] : []),
      })),
    }));
  },

  addEvent: (event: Event) => {
    set((state) => ({
      events: [event, ...state.events.slice(0, 99)],
    }));
  },

  addChatMessage: (agentId: string, message: ChatMessage) => {
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [agentId]: [...(state.chatMessages[agentId] || []), message],
      },
    }));
  },

  setSimulationSpeed: (speed: "pause" | "slow" | "normal" | "fast") => {
    set((state) => ({
      isRunning: speed !== "pause",
      time: { ...state.time, speed },
    }));
  },

  advanceTime: (minutes: number = 1) => {
    set((state) => {
      const newTime = new Date(
        state.time.currentTime.getTime() + minutes * 60000
      );
      return {
        time: {
          ...state.time,
          currentTime: newTime,
          hour: newTime.getHours(),
          minute: newTime.getMinutes(),
        },
      };
    });
  },

  updateTime: (newTime: Partial<SimulationTime>) => {
    set((state) => ({
      time: {
        ...state.time,
        ...newTime,
        currentTime: newTime.currentTime
          ? typeof newTime.currentTime === "string"
            ? new Date(newTime.currentTime)
            : newTime.currentTime
          : state.time.currentTime,
      },
    }));
  },

  toggleMemoryViewer: () => {
    set((state) => ({
      ui: { ...state.ui, showMemoryViewer: !state.ui.showMemoryViewer },
    }));
  },

  toggleDevTools: () => {
    set((state) => ({
      ui: { ...state.ui, showDevTools: !state.ui.showDevTools },
    }));
  },

  setActiveTab: (tab: "events" | "chat" | "agent-info") => {
    set((state) => ({
      ui: { ...state.ui, activeTab: tab },
    }));
  },

  updateAgentThought: (agentId: string, thought: string) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, currentThought: thought } : agent
      ),
    }));
  },

  updateAgentGoal: (agentId: string, goal: string) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, currentGoal: goal } : agent
      ),
    }));
  },

  addMemory: (agentId: string, memory: Memory) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId
          ? { ...agent, memories: [memory, ...(agent.memories || [])] }
          : agent
      ),
    }));
  },
  updateRelationship: (
    agent1: string,
    agent2: string,
    _relationship: string,
    strength: number
  ) => {
    set((state) => ({
      agents: state.agents.map((agent) => {
        if (agent.id === agent1) {
          return {
            ...agent,
            relationships: {
              ...agent.relationships,
              [agent2]: strength,
            },
          };
        }
        if (agent.id === agent2) {
          return {
            ...agent,
            relationships: {
              ...agent.relationships,
              [agent1]: strength,
            },
          };
        }
        return agent;
      }),
    }));
  },
}));
