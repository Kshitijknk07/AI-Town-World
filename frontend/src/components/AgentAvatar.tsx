import type { Agent } from "../types/agent";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AgentAvatarProps {
  agent: Agent;
  onClick?: () => void;
  selected?: boolean;
}

const AGENT_EMOJI = "🧑‍💼";

export function AgentAvatar({
  agent,
  onClick,
  selected = false,
}: AgentAvatarProps) {
  // Use first letter as fallback avatar
  return (
    <button
      className={`flex flex-col items-center focus:outline-none group transition-all duration-300 ${
        selected ? "scale-110 border-4 border-yellow-400 shadow-lg z-10" : ""
      }`}
      onClick={onClick}
      title={agent.name}
      type="button"
    >
      <Avatar
        className={`w-12 h-12 border-2 ${
          selected ? "border-yellow-400" : "border-gray-300"
        } bg-white transition-all`}
      >
        <AvatarFallback className="text-2xl">{AGENT_EMOJI}</AvatarFallback>
      </Avatar>
      <span className="text-xs text-gray-700 text-center max-w-[60px] truncate mt-1">
        {agent.name}
      </span>
    </button>
  );
}
