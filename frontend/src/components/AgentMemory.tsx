import type { Memory, Agent } from "../types/agent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AgentMoveDropdown } from "./AgentMoveDropdown";
import { AgentTalkDropdown } from "./AgentTalkDropdown";
import { motion, AnimatePresence } from "framer-motion";

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
      <DialogContent asChild className="animate-fadein">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="relative"
        >
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
          <div className="max-h-64 overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {!memories || memories.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-400 italic"
                >
                  No memories yet.
                </motion.div>
              ) : (
                <ul className="list-disc ml-6 space-y-1">
                  {memories.map((mem, idx) => (
                    <motion.li
                      key={mem.timestamp + idx}
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -40, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 18,
                      }}
                      className="text-sm text-gray-700 bg-yellow-50 rounded-lg px-2 py-1 mb-1 shadow-sm"
                    >
                      <span className="text-green-600">
                        [{new Date(mem.timestamp).toLocaleString()}]
                      </span>{" "}
                      – {mem.content}
                    </motion.li>
                  ))}
                </ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
