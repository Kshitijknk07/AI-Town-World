import { Building, Agent } from "../types";

export const MOCK_BUILDINGS: Building[] = [
  {
    id: "cafe-1",
    name: "The Grind",
    type: "cafe",
    position: { x: 2, y: 2 },
    size: { width: 2, height: 2 },
    icon: "☕",
    color: "bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50",
  },
  {
    id: "library-1",
    name: "City Library",
    type: "library",
    position: { x: 6, y: 1 },
    size: { width: 3, height: 2 },
    icon: "📚",
    color: "bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50",
  },
  {
    id: "park-1",
    name: "Central Park",
    type: "park",
    position: { x: 4, y: 5 },
    size: { width: 4, height: 3 },
    icon: "🌳",
    color: "bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800/50",
  },
  {
    id: "home-1",
    name: "Alex's House",
    type: "home",
    position: { x: 1, y: 6 },
    size: { width: 2, height: 2 },
    icon: "🏠",
    color: "bg-indigo-100 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800/50",
  },
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Alex",
    avatar: "🎨",
    position: { x: 2, y: 2 },
    color: "bg-red-500",
    status: "socializing",
  },
  {
    id: "agent-2",
    name: "Sam",
    avatar: "💻",
    position: { x: 7, y: 2 },
    color: "bg-blue-500",
    status: "working",
  },
  {
    id: "agent-3",
    name: "Taylor",
    avatar: "🏃",
    position: { x: 5, y: 6 },
    color: "bg-green-500",
    status: "moving",
  },
];
