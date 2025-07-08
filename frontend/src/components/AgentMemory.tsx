import type { Memory, Agent } from "../types/agent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AgentMoveDropdown } from "./AgentMoveDropdown";
import { AgentTalkDropdown } from "./AgentTalkDropdown";

interface AgentMemoryProps {
  open: boolean;
  onClose: () => void;
  agentName: string;
  agentId: string;
  memories: Memory[];
  agents: Agent[];
  onTalk: (toId: string, content: string) => void;
  onMove: (newLocation: string) => void;
}

export function AgentMemory({
  open,
  onClose,
  agentName,
  agentId,
  memories,
  agents,
  onTalk,
  onMove,
}: AgentMemoryProps) {
  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="animate-fadein">
        <DialogHeader>
          <DialogTitle>{agentName}&apos;s Memory Log</DialogTitle>
        </DialogHeader>
        {agentId && (
          <div className="flex flex-col gap-2 mb-4">
            <AgentMoveDropdown agentId={agentId} onMove={onMove} />
            <AgentTalkDropdown
              agent={agents.find((a) => a.id === agentId)!}
              agents={agents}
              onTalk={onTalk}
            />
          </div>
        )}
        {!memories || memories.length === 0 ? (
          <div className="text-gray-400 italic">No memories yet.</div>
        ) : (
          <ul className="list-disc ml-6 space-y-1">
            {memories.map((mem, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="text-green-600">
                  [{new Date(mem.timestamp).toLocaleString()}]
                </span>{" "}
                – {mem.content}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
