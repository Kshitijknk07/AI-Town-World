import { Agent, Event, Memory, Building } from "../types";

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export const getAgentById = (
  agents: Agent[],
  id: string
): Agent | undefined => {
  return agents.find((agent) => agent.id === id);
};

export const getAgentsAtLocation = (
  agents: Agent[],
  locationId: string
): Agent[] => {
  return agents.filter((agent) => agent.currentLocation === locationId);
};

export const getRelationshipScore = (
  agent: Agent,
  otherAgentId: string
): number => {
  return agent.relationships[otherAgentId] || 0;
};

export const getRelationshipLabel = (score: number): string => {
  if (score >= 0.8) return "Close Friends";
  if (score >= 0.5) return "Friends";
  if (score >= 0.2) return "Acquaintances";
  if (score >= -0.2) return "Neutral";
  if (score >= -0.5) return "Dislike";
  return "Enemies";
};

export const getMoodEmoji = (mood: number): string => {
  if (mood >= 0.7) return "😊";
  if (mood >= 0.3) return "🙂";
  if (mood >= -0.3) return "😐";
  if (mood >= -0.7) return "😕";
  return "😢";
};

export const getEnergyColor = (energy: number): string => {
  if (energy >= 80) return "text-green-600";
  if (energy >= 60) return "text-yellow-600";
  if (energy >= 40) return "text-orange-600";
  return "text-red-600";
};

export const getEventIcon = (type: Event["type"]): string => {
  switch (type) {
    case "agent_movement":
      return "🚶";
    case "interaction":
      return "💬";
    case "thought":
      return "💭";
    case "goal_completed":
      return "✅";
    case "memory_formed":
      return "🧠";
    default:
      return "📝";
  }
};

export const getEventColor = (importance: Event["importance"]): string => {
  switch (importance) {
    case "high":
      return "border-l-red-500 bg-red-50";
    case "medium":
      return "border-l-yellow-500 bg-yellow-50";
    case "low":
      return "border-l-gray-500 bg-gray-50";
    default:
      return "border-l-gray-500 bg-gray-50";
  }
};

export const getMemoryIcon = (type: Memory["type"]): string => {
  switch (type) {
    case "interaction":
      return "💬";
    case "event":
      return "📅";
    case "thought":
      return "💭";
    case "goal":
      return "🎯";
    default:
      return "📝";
  }
};

export const getEmotionalImpactColor = (impact: number): string => {
  if (impact >= 0.5) return "text-green-600";
  if (impact >= 0) return "text-blue-600";
  if (impact >= -0.5) return "text-orange-600";
  return "text-red-600";
};

export const getBuildingIcon = (type: Building["type"]): string => {
  switch (type) {
    case "home":
      return "🏠";
    case "shop":
      return "🛍️";
    case "park":
      return "🌳";
    case "cafe":
      return "☕";
    case "office":
      return "🏢";
    case "library":
      return "📖";
    default:
      return "🏢";
  }
};

export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

export const calculateTimeSpeed = (speed: string): number => {
  switch (speed) {
    case "pause":
      return 0;
    case "slow":
      return 0.5;
    case "normal":
      return 1;
    case "fast":
      return 3;
    default:
      return 1;
  }
};

export const getRandomThought = (): string => {
  const thoughts = [
    "I wonder what's happening today...",
    "Should I visit the cafe?",
    "I need to finish my current task.",
    "What a beautiful day!",
    "I hope I meet someone interesting.",
    "Time to get some work done.",
    "I feel like exploring today.",
    "Maybe I should read a book.",
    "I wonder if anyone is at the park.",
    "I should check on my friends.",
  ];
  return thoughts[Math.floor(Math.random() * thoughts.length)];
};

export const getRandomGoal = (): string => {
  const goals = [
    "Having coffee and chatting with friends",
    "Reading about new technologies",
    "Playing guitar and singing",
    "Taking a peaceful walk",
    "Working on my art project",
    "Studying in the library",
    "Meeting new people",
    "Relaxing and enjoying the day",
    "Planning my next adventure",
    "Helping others in the community",
  ];
  return goals[Math.floor(Math.random() * goals.length)];
};
