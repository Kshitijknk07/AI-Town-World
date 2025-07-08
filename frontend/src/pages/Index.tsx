import React from "react";
import { WorldMap } from "@/components/world/WorldMap";
import { AgentMemoryPanel } from "@/components/agent/AgentMemoryPanel";
import { useWorldState } from "@/hooks/useWorldState";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const {
    worldState,
    memories,
    isLoading,
    selectAgent,
    moveAgent,
    fetchAgentMemories,
    closeMemoryPanel,
  } = useWorldState();

  const handleAgentMove = async (agentId: string, targetZoneId: string) => {
    try {
      await moveAgent(agentId, targetZoneId);
      const agent = worldState.agents.find((a) => a.id === agentId);
      const zone = worldState.zones.find((z) => z.id === targetZoneId);

      toast({
        title: "Agent Moved",
        description: `${agent?.name} has moved to ${zone?.name}`,
      });
    } catch (error) {
      toast({
        title: "Move Failed",
        description: "Unable to move agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectedAgent = worldState.selectedAgentId
    ? worldState.agents.find((a) => a.id === worldState.selectedAgentId)
    : undefined;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <WorldMap
          zones={worldState.zones}
          agents={worldState.agents}
          selectedAgentId={worldState.selectedAgentId}
          onAgentSelect={selectAgent}
          onAgentMove={handleAgentMove}
          isMoving={worldState.isMoving}
        />

        <AgentMemoryPanel
          agent={selectedAgent}
          memories={memories}
          isOpen={worldState.isMemoryPanelOpen}
          isLoading={isLoading}
          onClose={closeMemoryPanel}
          onFetchMemories={fetchAgentMemories}
        />
      </div>
    </TooltipProvider>
  );
};

export default Index;
