import type { Agent } from "../types/agent";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MessageCircle } from "lucide-react";

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
      <SelectTrigger className="mt-4 w-full bg-purple-800 text-white border-purple-400">
        <MessageCircle className="mr-2 h-4 w-4 text-yellow-300" />
        <SelectValue placeholder="💬 Talk to another agent..." />
      </SelectTrigger>
      <SelectContent>
        {agents
          .filter((a) => a.id !== agent.id)
          .map((target) => (
            <SelectItem key={target.id} value={target.id}>
              {target.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
