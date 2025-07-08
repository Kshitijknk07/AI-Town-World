import type { Agent } from "../types/agent";

interface AgentAvatarProps {
  agent: Agent;
  onClick?: () => void;
}

export function AgentAvatar({ agent, onClick }: AgentAvatarProps) {
  // Use first letter as fallback avatar
  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  // Optionally, you could add an emoji property to Agent type for richer avatars
  return (
    <div
      className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
      onClick={onClick}
      title={agent.name}
    >
      <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center text-2xl font-bold mb-1">
        {initials}
      </div>
      <span className="text-xs text-white text-center max-w-[60px] truncate">
        {agent.name}
      </span>
    </div>
  );
}
