import type { Agent } from "../types/agent";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

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
    <motion.button
      className="flex flex-col items-center focus:outline-none group"
      onClick={onClick}
      title={agent.name}
      type="button"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: selected ? 1.18 : 1 }}
      whileHover={{ scale: 1.12, boxShadow: "0 0 0 4px #fde68a" }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{ zIndex: selected ? 2 : 1 }}
    >
      <motion.div
        animate={
          selected
            ? { boxShadow: "0 0 0 6px #fde047, 0 0 16px #fde047" }
            : { boxShadow: "0 0 0 0px #fde047" }
        }
        transition={{ duration: 0.3 }}
        className="rounded-full"
      >
        <Avatar
          className={`w-12 h-12 border-2 ${
            selected ? "border-yellow-400" : "border-gray-300"
          } bg-white transition-all`}
        >
          <AvatarFallback className="text-2xl">{AGENT_EMOJI}</AvatarFallback>
        </Avatar>
      </motion.div>
      <span className="text-xs text-gray-700 text-center max-w-[60px] truncate mt-1">
        {agent.name}
      </span>
    </motion.button>
  );
}
