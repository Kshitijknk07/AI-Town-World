import { create } from "zustand";
import { SimulationState, Agent, Event, ChatMessage, Building } from "../types";

const mockAgents: Agent[] = [
  {
    id: "alice",
    name: "Alice",
    personality: {
      traits: ["curious", "friendly", "artistic"],
      goals: ["make friends", "paint landscapes", "explore the town"],
      fears: ["being alone", "running out of paint"],
      interests: ["art", "nature", "conversation"],
    },
    currentLocation: "cafe",
    currentGoal: "Having coffee and chatting with friends",
    currentThought: "I wonder if Jamie will show up today...",
    memories: [
      {
        id: "1",
        timestamp: new Date(Date.now() - 3600000),
        type: "interaction",
        content: "Had a great conversation with Bob about art",
        relatedAgent: "bob",
        location: "cafe",
        emotionalImpact: 0.8,
      },
    ],
    relationships: { bob: 0.7, jamie: 0.3 },
    energy: 85,
    mood: 0.6,
    schedule: {
      wakeTime: "07:00",
      sleepTime: "22:00",
      activities: [
        {
          time: "08:00",
          location: "home",
          activity: "Morning routine",
          priority: "high",
        },
        {
          time: "10:00",
          location: "cafe",
          activity: "Coffee and socializing",
          priority: "medium",
        },
        {
          time: "14:00",
          location: "park",
          activity: "Painting outdoors",
          priority: "high",
        },
      ],
    },
    avatar: "🎨",
    isSelected: false,
  },
  {
    id: "bob",
    name: "Bob",
    personality: {
      traits: ["analytical", "helpful", "introverted"],
      goals: ["solve problems", "help others", "learn new things"],
      fears: ["confrontation", "being wrong"],
      interests: ["technology", "books", "quiet spaces"],
    },
    currentLocation: "library",
    currentGoal: "Reading about new technologies",
    currentThought: "This book on AI is fascinating...",
    memories: [
      {
        id: "2",
        timestamp: new Date(Date.now() - 7200000),
        type: "interaction",
        content: "Discussed art with Alice at the cafe",
        relatedAgent: "alice",
        location: "cafe",
        emotionalImpact: 0.6,
      },
    ],
    relationships: { alice: 0.7, jamie: -0.2 },
    energy: 70,
    mood: 0.4,
    schedule: {
      wakeTime: "06:00",
      sleepTime: "23:00",
      activities: [
        {
          time: "07:00",
          location: "home",
          activity: "Morning reading",
          priority: "high",
        },
        {
          time: "12:00",
          location: "library",
          activity: "Research and study",
          priority: "high",
        },
        {
          time: "18:00",
          location: "home",
          activity: "Evening routine",
          priority: "medium",
        },
      ],
    },
    avatar: "📚",
    isSelected: false,
  },
  {
    id: "jamie",
    name: "Jamie",
    personality: {
      traits: ["energetic", "social", "impulsive"],
      goals: ["have fun", "meet new people", "try new things"],
      fears: ["boredom", "being left out"],
      interests: ["sports", "music", "adventure"],
    },
    currentLocation: "park",
    currentGoal: "Playing guitar and singing",
    currentThought: "I hope someone comes to listen to my music...",
    memories: [
      {
        id: "3",
        timestamp: new Date(Date.now() - 1800000),
        type: "event",
        content: "Saw Bob at the library but he seemed busy",
        relatedAgent: "bob",
        location: "library",
        emotionalImpact: -0.3,
      },
    ],
    relationships: { alice: 0.3, bob: -0.2 },
    energy: 95,
    mood: 0.8,
    schedule: {
      wakeTime: "08:00",
      sleepTime: "01:00",
      activities: [
        {
          time: "09:00",
          location: "park",
          activity: "Morning exercise",
          priority: "high",
        },
        {
          time: "15:00",
          location: "park",
          activity: "Music practice",
          priority: "medium",
        },
        {
          time: "20:00",
          location: "cafe",
          activity: "Evening socializing",
          priority: "high",
        },
      ],
    },
    avatar: "🎸",
    isSelected: false,
  },
];

const mockBuildings: Building[] = [
  {
    id: "cafe",
    name: "Sunshine Cafe",
    type: "cafe",
    position: { x: 300, y: 200 },
    capacity: 20,
    currentOccupants: ["alice"],
    description: "A cozy cafe with great coffee and pastries",
    icon: "☕",
  },
  {
    id: "library",
    name: "Town Library",
    type: "library",
    position: { x: 500, y: 150 },
    capacity: 15,
    currentOccupants: ["bob"],
    description: "Quiet space for reading and research",
    icon: "📖",
  },
  {
    id: "park",
    name: "Central Park",
    type: "park",
    position: { x: 400, y: 350 },
    capacity: 50,
    currentOccupants: ["jamie"],
    description: "Beautiful green space with walking paths",
    icon: "🌳",
  },
  {
    id: "home-alice",
    name: "Alice's Home",
    type: "home",
    position: { x: 150, y: 250 },
    capacity: 4,
    currentOccupants: [],
    description: "A charming cottage with an art studio",
    icon: "🏠",
  },
  {
    id: "home-bob",
    name: "Bob's Home",
    type: "home",
    position: { x: 600, y: 100 },
    capacity: 3,
    currentOccupants: [],
    description: "A modern apartment with lots of books",
    icon: "🏠",
  },
  {
    id: "home-jamie",
    name: "Jamie's Home",
    type: "home",
    position: { x: 200, y: 450 },
    capacity: 2,
    currentOccupants: [],
    description: "A vibrant apartment with musical instruments",
    icon: "🏠",
  },
];

const mockEvents: Event[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 3600000),
    type: "interaction",
    agentId: "alice",
    agentName: "Alice",
    location: "cafe",
    description: "Alice had a great conversation with Bob about art",
    importance: "medium",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1800000),
    type: "agent_movement",
    agentId: "jamie",
    agentName: "Jamie",
    location: "park",
    description: "Jamie moved to the park to practice music",
    importance: "low",
  },
];

export const useSimulationStore = create<SimulationState>((set) => ({
  isRunning: true,
  time: {
    currentTime: new Date(),
    speed: "normal",
    day: 1,
    hour: 10,
    minute: 30,
  },
  agents: mockAgents,
  buildings: mockBuildings,
  events: mockEvents,
  selectedAgentId: null,
  chatMessages: {},
  ui: {
    showMemoryViewer: false,
    showDevTools: false,
    activeTab: "events",
  },

  setSelectedAgent: (agentId: string | null) => {
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
}));
