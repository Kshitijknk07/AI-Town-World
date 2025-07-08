export interface Agent {
  id: string;
  name: string;
  role: string;
  backstory: string;
  currentLocation: string;
  avatar?: string;
  color: string;
  status: "idle" | "moving" | "talking" | "thinking";
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  type: "residential" | "commercial" | "park" | "civic" | "special";
  x: number;
  y: number;
  capacity: number;
  agentIds: string[];
}

export interface Memory {
  id: string;
  agentId: string;
  type: "observation" | "conversation" | "action" | "thought";
  content: string;
  timestamp: Date;
  location: string;
  importance: number;
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: ConversationMessage[];
  location: string;
  startTime: Date;
  endTime?: Date;
}

export interface ConversationMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface WorldState {
  agents: Agent[];
  zones: Zone[];
  conversations: Conversation[];
  selectedAgentId?: string;
  isMemoryPanelOpen: boolean;
  isMoving: boolean;
  isTalking: boolean;
}
