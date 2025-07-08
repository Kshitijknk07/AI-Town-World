import type { Agent } from "../types/agent";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AgentTalkDropdownProps {
  agent: Agent;
  agents: Agent[];
  onTalk: (toId: string, content: string) => void;
}

export function AgentTalkDropdown({
  agent,
  agents,
  onTalk,
}: AgentTalkDropdownProps) {
  return (
    <Select
      onValueChange={(targetId) => {
        if (!targetId) return;
        const content = prompt(
          `What should ${agent.name} say to ${
            agents.find((a) => a.id === targetId)?.name
          }?`
        );
        if (content) {
          onTalk(targetId, content);
        }
      }}
    >
      <SelectTrigger className="mt-4 w-full bg-purple-100 text-purple-900 border-purple-300 font-semibold shadow hover:bg-purple-200 transition-all">
        <MessageCircle className="mr-2 h-4 w-4 text-yellow-400" />
        <SelectValue placeholder="💬 Talk to another agent..." />
      </SelectTrigger>
      <SelectContent asChild>
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {agents
            .filter((a) => a.id !== agent.id)
            .map((target) => (
              <SelectItem
                key={target.id}
                value={target.id}
                className="text-base hover:bg-yellow-100 cursor-pointer"
              >
                {target.name}
              </SelectItem>
            ))}
        </motion.ul>
      </SelectContent>
    </Select>
  );
}
