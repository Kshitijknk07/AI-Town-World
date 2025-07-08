// Agent-related type definitions
export type Agent = {
  id: string;
  name: string;
  role: string;
  personality: string;
  backstory: string;
  location: string;
  memory: Memory[];
};

export type Memory = {
  timestamp: string;
  type: string;
  content: string;
};

export type AgentMemoryMap = {
  [agentId: string]: Memory[];
};
