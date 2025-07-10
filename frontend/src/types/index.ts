export interface Personality {
  traits: string[];
  goals: string[];
  fears: string[];
  interests: string[];
}

export interface Memory {
  id: string;
  timestamp: Date;
  type: "interaction" | "event" | "thought" | "goal";
  content: string;
  relatedAgent?: string;
  location?: string;
  emotionalImpact: number;
}

export interface Agent {
  id: string;
  name: string;
  personality: Personality;
  currentLocation: string;
  currentGoal: string;
  currentThought: string;
  memories: Memory[];
  relationships: Record<string, number>;
  energy: number;
  mood: number;
  schedule: DailySchedule;
  avatar: string;
  isSelected: boolean;
}

export interface DailySchedule {
  wakeTime: string;
  sleepTime: string;
  activities: ScheduledActivity[];
}

export interface ScheduledActivity {
  time: string;
  location: string;
  activity: string;
  priority: "high" | "medium" | "low";
}

export interface Building {
  id: string;
  name: string;
  type: "home" | "shop" | "park" | "cafe" | "office" | "library";
  position: { x: number; y: number };
  capacity: number;
  currentOccupants: string[];
  description: string;
  icon: string;
}

export interface Location {
  id: string;
  name: string;
  type: "indoor" | "outdoor";
  buildings: Building[];
  connections: string[];
}

export interface Event {
  id: string;
  timestamp: Date;
  type:
    | "agent_movement"
    | "interaction"
    | "thought"
    | "goal_completed"
    | "memory_formed";
  agentId?: string;
  agentName?: string;
  location?: string;
  description: string;
  importance: "low" | "medium" | "high";
}

export interface ChatMessage {
  id: string;
  timestamp: Date;
  agentId: string;
  agentName: string;
  content: string;
  type: "user" | "agent";
}

export interface SimulationTime {
  currentTime: Date;
  speed: "pause" | "slow" | "normal" | "fast";
  day: number;
  hour: number;
  minute: number;
}

export interface SimulationState {
  updateTime: any;
  isRunning: boolean;
  time: SimulationTime;
  agents: Agent[];
  buildings: Building[];
  events: Event[];
  selectedAgentId: string | null;
  chatMessages: Record<string, ChatMessage[]>;
  ui: {
    showMemoryViewer: boolean;
    showDevTools: boolean;
    activeTab: "events" | "chat" | "agent-info" | "relationships";
  };
  fetchAgents: () => Promise<void>;
  addAgent: (agentData: Partial<Agent>) => Promise<void>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  setSelectedAgent: (agentId: string | null) => void;
  updateAgentLocation: (agentId: string, newLocation: string) => void;
  addEvent: (event: Event) => void;
  addChatMessage: (agentId: string, message: ChatMessage) => void;
  setSimulationSpeed: (speed: "pause" | "slow" | "normal" | "fast") => void;
  advanceTime: (minutes?: number) => void;
  toggleMemoryViewer: () => void;
  toggleDevTools: () => void;
  setActiveTab: (tab: "events" | "chat" | "agent-info") => void;
  updateAgentThought: (agentId: string, thought: string) => void;
  updateAgentGoal: (agentId: string, goal: string) => void;
  addMemory: (agentId: string, memory: Memory) => void;
  updateRelationship: (
    agent1: string,
    agent2: string,
    relationship: string,
    strength: number
  ) => void;
}

export interface UIPanel {
  id: string;
  title: string;
  isOpen: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface MapView {
  zoom: number;
  center: { x: number; y: number };
  selectedLocation: string | null;
}

export interface APIAgent {
  id: string;
  name: string;
  personality: Personality;
  currentLocation: string;
  currentGoal: string;
  currentThought: string;
  energy: number;
  mood: number;
}

export interface APIEvent {
  id: string;
  timestamp: string;
  type: string;
  agentId?: string;
  description: string;
  importance: string;
}
