import type { Agent } from "../types/agent";
import { AgentAvatar } from "./AgentAvatar";
import { motion, AnimatePresence } from "framer-motion";

const ZONE_EMOJIS: Record<string, string> = {
  Park: "🌳",
  Gallery: "🖼️",
  Library: "📚",
  Cafe: "☕",
  Plaza: "🏛️",
  Workshop: "🛠️",
};

interface ZoneProps {
  name: string;
  agents: Agent[];
  selectedAgentId?: string | null;
  onAgentClick?: (agent: Agent) => void;
}

export function Zone({
  name,
  agents,
  selectedAgentId,
  onAgentClick,
}: ZoneProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-md flex flex-col items-center min-h-[160px] px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{ZONE_EMOJIS[name] || "❓"}</span>
        <span className="font-bold text-gray-700 text-lg">{name}</span>
      </div>
      <div className="flex flex-wrap gap-3 justify-center w-full">
        <AnimatePresence initial={false}>
          {agents.length === 0 ? (
            <span className="text-gray-400 text-xs" key="empty">
              (empty)
            </span>
          ) : (
            agents.map((agent) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={
                  selectedAgentId === agent.id
                    ? "ring-4 ring-yellow-400 rounded-full animate-pulse"
                    : ""
                }
              >
                <AgentAvatar
                  agent={agent}
                  selected={selectedAgentId === agent.id}
                  onClick={onAgentClick ? () => onAgentClick(agent) : undefined}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
