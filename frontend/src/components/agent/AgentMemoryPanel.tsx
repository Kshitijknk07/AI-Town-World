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
  observation: <Eye className="w-4 h-4" />,
  conversation: <MessageCircle className="w-4 h-4" />,
  movement: <MapPin className="w-4 h-4" />,
  thought: <Lightbulb className="w-4 h-4" />,
};

const memoryTypeLabels = {
  observation: "Saw something",
  conversation: "Talked to someone",
  movement: "Moved somewhere",
  thought: "Had an idea",
};

const importanceColors = {
  1: "bg-gray-100",
  2: "bg-gray-100",
  3: "bg-blue-100",
  4: "bg-blue-100",
  5: "bg-yellow-100",
  6: "bg-yellow-100",
  7: "bg-orange-100",
  8: "bg-orange-100",
  9: "bg-red-100",
  10: "bg-red-100",
};

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
        setAdding(true);
        try {
          await addAgentMemory(agent.id, {
            type: memoryType,
            content: memoryContent,
          });
          toast({
            title: "Memory added",
            description: "A new memory was added.",
          });
          setMemoryContent("");
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
      [memoryContent, memoryType, agent, addAgentMemory]
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
            description: "Message sent to agent.",
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
        <SheetContent className="w-[400px] sm:w-[540px] overflow-hidden">
          <SheetHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.name.charAt(0)}
                </div>
                {}
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    agent.status === "idle"
                      ? "bg-green-400"
                      : agent.status === "moving"
                      ? "bg-blue-400"
                      : agent.status === "talking"
                      ? "bg-yellow-400"
                      : "bg-purple-400"
                  }`}
                />
              </div>
              <div>
                <SheetTitle className="text-xl">{agent.name}</SheetTitle>
                <SheetDescription className="text-base">
                  {agent.role} •{" "}
                  <span className="capitalize">{agent.status}</span>
                </SheetDescription>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-4">
                <p className="text-sm text-gray-700 italic">
                  "{agent.backstory}"
                </p>
              </CardContent>
            </Card>
          </SheetHeader>

          <Separator className="my-4" />

          <div className="space-y-4 flex-1">
            {}
            <form
              onSubmit={handleAddMemory}
              className="flex flex-col gap-2 mb-4"
            >
              <div className="flex gap-2 items-center">
                <Select value={memoryType} onValueChange={setMemoryType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="observation">Saw something</SelectItem>
                    <SelectItem value="conversation">
                      Talked to someone
                    </SelectItem>
                    <SelectItem value="movement">Moved somewhere</SelectItem>
                    <SelectItem value="thought">Had an idea</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  disabled={adding || !memoryContent.trim()}
                >
                  {adding ? "Adding..." : "Add Memory"}
                </Button>
              </div>
              <Textarea
                value={memoryContent}
                onChange={(e) => setMemoryContent(e.target.value)}
                placeholder="What happened? (e.g., 'Saw a beautiful sunset at the park')"
                rows={2}
                className="resize-none"
                disabled={adding}
              />
            </form>

            {}
            <form
              onSubmit={handleTalkSubmit}
              className="flex flex-col gap-2 mb-4"
            >
              <div className="flex gap-2 items-center">
                <Select value={talkToId} onValueChange={setTalkToId}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Talk to..." />
                  </SelectTrigger>
                  <SelectContent>
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
                >
                  {talking ? "Sending..." : "Talk"}
                </Button>
              </div>
              <Textarea
                value={talkContent}
                onChange={(e) => setTalkContent(e.target.value)}
                placeholder="What do you want to say? (e.g., 'Hello! How are you today?')"
                rows={2}
                className="resize-none"
                disabled={talking}
              />
            </form>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Memory Log
              </h3>
              <Badge variant="secondary">{memories.length} memories</Badge>
            </div>

            <ScrollArea className="h-[calc(100vh-300px)]">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : memories.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Brain className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      No memories found for this agent.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Add memories using the form above!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {sortedMemories.map((memory) => (
                    <Card
                      key={memory.id}
                      className={`transition-all duration-200 hover:shadow-md ${
                        importanceColors[
                          memory.importance as keyof typeof importanceColors
                        ] || "bg-gray-50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {memoryTypeIcons[memory.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
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
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {memory.content}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {memory.location || "Unknown location"}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">
                                  Importance:
                                </span>
                                <div className="flex">
                                  {[...Array(10)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                        i < memory.importance
                                          ? "bg-yellow-400"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
);

AgentMemoryPanel.displayName = "AgentMemoryPanel";
