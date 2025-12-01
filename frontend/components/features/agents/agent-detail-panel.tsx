"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Brain, Activity, X } from "lucide-react";
import { useUIStore } from "@/components/store/ui-store";
import { Agent } from "../map/types";
import { cn } from "@/lib/utils";
import { ChatInterface } from "../chat/chat-interface";

export function AgentDetailPanel() {
  const { selectedAgentId, agents, setSelectedAgentId } = useUIStore();
  const agent = agents.find((a: Agent) => a.id === selectedAgentId);

  if (!agent) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-background/50 backdrop-blur-sm">
        <div className="rounded-full bg-muted/50 p-6 mb-6 ring-1 ring-border/50">
          <Activity className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="font-display text-xl font-medium tracking-tight">Select an Agent</h3>
        <p className="text-muted-foreground mt-2 max-w-[240px] leading-relaxed">
          Click on any agent on the map to view their live status and details.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur-md border-l shadow-2xl animate-in slide-in-from-right-6 duration-500 ease-out">
      {/* Header Section */}
      <div className="relative p-6 pb-8 bg-gradient-to-b from-muted/30 to-transparent">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-background/80"
          onClick={() => setSelectedAgentId(null)}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-1 ring-border/10">
              <AvatarFallback className={cn("text-3xl", agent.color)}>
                {agent.avatar}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-background"></span>
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-display font-bold tracking-tight">{agent.name}</h2>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Badge
                variant="secondary"
                className="px-3 py-0.5 rounded-full font-normal bg-background/50 border-border/50 capitalize"
              >
                {agent.status}
              </Badge>
              <span>•</span>
              <span>Level 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-8">
            <TabsTrigger
              value="overview"
              className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-medium text-muted-foreground data-[state=active]:text-foreground transition-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="memory"
              className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-medium text-muted-foreground data-[state=active]:text-foreground transition-none"
            >
              Memory
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-medium text-muted-foreground data-[state=active]:text-foreground transition-none"
            >
              Chat
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className={cn("flex-1 bg-muted/5", "data-[state=active]:p-0")}>
          <div className="h-full">
            <TabsContent
              value="overview"
              className="mt-0 p-6 space-y-8 animate-in fade-in-50 duration-300"
            >
              {/* Current Activity Card */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  Current Activity
                </h4>
                <div className="bg-card p-4 rounded-xl border shadow-sm text-sm leading-relaxed">
                  {agent.status === "socializing"
                    ? "Currently chatting with other agents at the Cafe, discussing local events and sharing stories."
                    : "Wandering around the town, observing the environment and looking for interesting interactions."}
                </div>
              </div>

              {/* Personality Card */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Brain className="h-3 w-3" />
                  Personality Traits
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Friendly", "Curious", "Energetic", "Creative"].map((trait) => (
                    <div
                      key={trait}
                      className="px-3 py-1.5 bg-card border rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow cursor-default"
                    >
                      {trait}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats / Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-xl border shadow-sm space-y-1">
                  <div className="text-xs text-muted-foreground">Energy</div>
                  <div className="text-xl font-semibold">85%</div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[85%]" />
                  </div>
                </div>
                <div className="p-4 bg-card rounded-xl border shadow-sm space-y-1">
                  <div className="text-xs text-muted-foreground">Mood</div>
                  <div className="text-xl font-semibold">Happy</div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[90%]" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="memory" className="mt-0 p-6 animate-in fade-in-50 duration-300">
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="p-4 rounded-full bg-muted/50">
                  <Brain className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Memory Stream</h3>
                  <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                    Agent memories and past interactions will appear here.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="chat"
              className="mt-0 h-full animate-in fade-in-50 duration-300 data-[state=inactive]:hidden"
            >
              <ChatInterface agent={agent} />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
