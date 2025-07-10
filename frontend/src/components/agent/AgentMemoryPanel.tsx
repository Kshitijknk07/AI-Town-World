import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Agent, Memory } from "@/types/agent";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  MessageCircle,
  Eye,
  Lightbulb,
  MapPin,
  Clock,
  Sparkles,
  Heart,
  Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useWorldState } from "@/hooks/useWorldState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentMemoryPanelProps {
  agent: Agent | undefined;
  memories: Memory[];
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onFetchMemories: (agentId: string) => void;
  agents: Agent[];
}

const memoryTypeIcons = {
  observation: <Eye className="w-4 h-4 text-blue-500" />,
  conversation: <MessageCircle className="w-4 h-4 text-green-500" />,
  movement: <MapPin className="w-4 h-4 text-purple-500" />,
  thought: <Lightbulb className="w-4 h-4 text-yellow-500" />,
};

const memoryTypeLabels = {
  observation: "Observed something",
  conversation: "Had a conversation",
  movement: "Moved somewhere",
  thought: "Had a thought",
};

const importanceColors = {
  1: "bg-gray-50 border-gray-200",
  2: "bg-gray-50 border-gray-200",
  3: "bg-blue-50 border-blue-200",
  4: "bg-blue-50 border-blue-200",
  5: "bg-yellow-50 border-yellow-200",
  6: "bg-yellow-50 border-yellow-200",
  7: "bg-orange-50 border-orange-200",
  8: "bg-orange-50 border-orange-200",
  9: "bg-red-50 border-red-200",
  10: "bg-red-50 border-red-200",
};

const availableZones = [
  "bookstore",
  "town-hall",
  "school", 
  "residential-1",
  "cafe",
  "residential-2",
  "park",
  "library",
  "market",
];

export const AgentMemoryPanel: React.FC<AgentMemoryPanelProps> = React.memo(
  ({
    agent,
    memories,
    isOpen,
    isLoading,
    onClose,
    onFetchMemories,
    agents,
  }) => {
    const { addAgentMemory, recordConversation } = useWorldState();
    const [memoryType, setMemoryType] = useState("observation");
    const [memoryContent, setMemoryContent] = useState("");
    const [memoryDestination, setMemoryDestination] = useState("");
    const [adding, setAdding] = useState(false);
    const [talkToId, setTalkToId] = useState("");
    const [talkContent, setTalkContent] = useState("");
    const [talking, setTalking] = useState(false);

    const otherAgents = useMemo(
      () => agents.filter((a) => a.id !== agent?.id),
      [agents, agent?.id]
    );

    const sortedMemories = useMemo(
      () =>
        memories.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      [memories]
    );

    useEffect(() => {
      if (memoryType !== "movement") {
        setMemoryDestination("");
      }
    }, [memoryType]);

    useEffect(() => {
      if (agent && isOpen) {
        onFetchMemories(agent.id);
      }
    }, [agent?.id, isOpen, onFetchMemories]);

    const handleAddMemory = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memoryContent.trim() || !agent) {
          toast({
            title: "Content required",
            description: "Please enter memory content.",
            variant: "destructive",
          });
          return;
        }

        if (memoryType === "movement" && !memoryDestination) {
          toast({
            title: "Destination required",
            description: "Please select a destination for movement.",
            variant: "destructive",
          });
          return;
        }

        setAdding(true);
        try {
          const finalContent =
            memoryType === "movement"
              ? `${memoryContent} to ${memoryDestination
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}`
              : memoryContent;

          await addAgentMemory(agent.id, {
            type: memoryType,
            content: finalContent,
          });
          toast({
            title: "Memory added",
            description: "A new memory was created.",
          });
          setMemoryContent("");
          setMemoryDestination("");
        } catch (err) {
          toast({
            title: "Failed to add memory",
            description: "Please try again.",
            variant: "destructive",
          });
        } finally {
          setAdding(false);
        }
      },
      [memoryContent, memoryType, memoryDestination, agent, addAgentMemory]
    );

    const handleTalkSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!talkToId || !talkContent.trim() || !agent) {
          toast({
            title: "Recipient and message required",
            description: "Select an agent and enter a message.",
            variant: "destructive",
          });
          return;
        }
        setTalking(true);
        try {
          await recordConversation(agent.id, talkToId, talkContent);
          toast({
            title: "Conversation recorded",
            description: "Message sent successfully.",
          });
          setTalkContent("");
        } catch (err) {
          toast({
            title: "Failed to send message",
            description: "Please try again.",
            variant: "destructive",
          });
        } finally {
          setTalking(false);
        }
      },
      [talkToId, talkContent, agent, recordConversation]
    );

    if (!agent) return null;

    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-hidden glass-effect border-white/30">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SheetHeader className="space-y-4 pb-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.name.charAt(0)}
                  </div>
                  <motion.div
                    className={cn(
                      "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm",
                      agent.status === "idle"
                        ? "bg-emerald-400"
                        : agent.status === "moving"
                        ? "bg-blue-400"
                        : agent.status === "talking"
                        ? "bg-yellow-400"
                        : "bg-purple-400"
                    )}
                    animate={agent.status === "moving" ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
                <div className="flex-1">
                  <SheetTitle className="text-2xl font-bold text-gray-800">
                    {agent.name}
                  </SheetTitle>
                  <SheetDescription className="text-lg text-indigo-600 font-medium">
                    {agent.role} • <span className="capitalize">{agent.status}</span>
                  </SheetDescription>
                </div>
              </div>

              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    "{agent.backstory}"
                  </p>
                </CardContent>
              </Card>
            </SheetHeader>

            <Separator className="my-6 bg-white/30" />

            <div className="space-y-6 flex-1">
              {/* Add Memory Form */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-effect border-white/50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Create New Memory
                    </h3>
                    <form onSubmit={handleAddMemory} className="space-y-3">
                      <div className="flex gap-2 items-center">
                        <Select value={memoryType} onValueChange={setMemoryType}>
                          <SelectTrigger className="w-48 glass-effect border-white/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-effect">
                            <SelectItem value="observation">Observed something</SelectItem>
                            <SelectItem value="conversation">Had conversation</SelectItem>
                            <SelectItem value="movement">Moved somewhere</SelectItem>
                            <SelectItem value="thought">Had a thought</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="submit"
                          disabled={
                            adding ||
                            !memoryContent.trim() ||
                            (memoryType === "movement" && !memoryDestination)
                          }
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                        >
                          {adding ? "Adding..." : "Add Memory"}
                        </Button>
                      </div>

                      {memoryType === "movement" && (
                        <Select
                          value={memoryDestination}
                          onValueChange={setMemoryDestination}
                        >
                          <SelectTrigger className="glass-effect border-white/50">
                            <SelectValue placeholder="Select destination..." />
                          </SelectTrigger>
                          <SelectContent className="glass-effect">
                            {availableZones.map((zoneId) => (
                              <SelectItem key={zoneId} value={zoneId}>
                                {zoneId
                                  .replace("-", " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      <Textarea
                        value={memoryContent}
                        onChange={(e) => setMemoryContent(e.target.value)}
                        placeholder={
                          memoryType === "movement"
                            ? "What happened during the move? (e.g., 'Walked through the peaceful gardens')"
                            : memoryType === "observation"
                            ? "What did you observe? (e.g., 'Saw a beautiful sunset painting the sky')"
                            : memoryType === "conversation"
                            ? "What was discussed? (e.g., 'Had an inspiring chat about art')"
                            : "What thought occurred? (e.g., 'Wondered about the nature of creativity')"
                        }
                        rows={3}
                        className="resize-none glass-effect border-white/50"
                        disabled={adding}
                      />
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Conversation Form */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-effect border-white/50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      Start Conversation
                    </h3>
                    <form onSubmit={handleTalkSubmit} className="space-y-3">
                      <div className="flex gap-2 items-center">
                        <Select value={talkToId} onValueChange={setTalkToId}>
                          <SelectTrigger className="w-48 glass-effect border-white/50">
                            <SelectValue placeholder="Talk to..." />
                          </SelectTrigger>
                          <SelectContent className="glass-effect">
                            {otherAgents.map((a) => (
                              <SelectItem key={a.id} value={a.id}>
                                {a.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="submit"
                          disabled={talking || !talkToId || !talkContent.trim()}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          {talking ? "Sending..." : "Send Message"}
                        </Button>
                      </div>
                      <Textarea
                        value={talkContent}
                        onChange={(e) => setTalkContent(e.target.value)}
                        placeholder="What would you like to say? (e.g., 'Hello! How has your day been?')"
                        rows={2}
                        className="resize-none glass-effect border-white/50"
                        disabled={talking}
                      />
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Memory Log */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-gray-800">
                    <Brain className="w-6 h-6 text-purple-500" />
                    Memory Archive
                  </h3>
                  <Badge variant="secondary" className="bg-white/80">
                    {memories.length} memories
                  </Badge>
                </div>

                <ScrollArea className="h-[calc(100vh-600px)] pr-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse glass-effect">
                          <CardContent className="p-4">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : memories.length === 0 ? (
                    <Card className="glass-effect border-white/50">
                      <CardContent className="p-8 text-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-500 text-lg font-medium">
                            No memories yet
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            Create the first memory using the form above!
                          </p>
                        </motion.div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {sortedMemories.map((memory, index) => (
                          <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card
                              className={cn(
                                "transition-all duration-300 hover:shadow-lg hover:scale-[1.02] glass-effect border-white/50",
                                importanceColors[
                                  memory.importance as keyof typeof importanceColors
                                ] || "bg-gray-50 border-gray-200"
                              )}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <motion.div 
                                    className="flex-shrink-0 mt-1"
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                  >
                                    {memoryTypeIcons[memory.type]}
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs capitalize bg-white/80"
                                      >
                                        {memoryTypeLabels[memory.type] || memory.type}
                                      </Badge>
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(
                                          new Date(memory.timestamp),
                                          { addSuffix: true }
                                        )}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-800 leading-relaxed mb-3">
                                      {memory.content}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {memory.location || "Unknown location"}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                          Importance:
                                        </span>
                                        <div className="flex">
                                          {[...Array(10)].map((_, i) => (
                                            <motion.div
                                              key={i}
                                              className={cn(
                                                "w-1.5 h-1.5 rounded-full mx-0.5",
                                                i < memory.importance
                                                  ? "bg-yellow-400"
                                                  : "bg-gray-200"
                                              )}
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{ delay: i * 0.05 }}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </ScrollArea>
              </motion.div>
            </div>
          </motion.div>
        </SheetContent>
      </Sheet>
    );
  }
);

AgentMemoryPanel.displayName = "AgentMemoryPanel";