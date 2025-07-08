import React from "react";
import { Agent, Zone } from "@/types/agent";
import { AgentAvatar } from "./AgentAvatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ZoneTileProps {
  zone: Zone;
  agents: Agent[];
  selectedAgentId?: string;
  allAgents: Agent[];
  onAgentSelect: (agentId: string) => void;
  onAgentMove: (agentId: string, targetZoneId: string) => void;
  isMoving: boolean;
}

const zoneTypeColors = {
  residential: "bg-green-100 border-green-300",
  commercial: "bg-blue-100 border-blue-300",
  park: "bg-emerald-100 border-emerald-300",
  civic: "bg-purple-100 border-purple-300",
  special: "bg-yellow-100 border-yellow-300",
};

const zoneTypeIcons = {
  residential: "🏠",
  commercial: "🏪",
  park: "🌳",
  civic: "🏛️",
  special: "⭐",
};

export const ZoneTile: React.FC<ZoneTileProps> = ({
  zone,
  agents,
  selectedAgentId,
  allAgents,
  onAgentSelect,
  onAgentMove,
  isMoving,
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const agentId = e.dataTransfer.getData("agent-id");
    if (agentId && agentId !== selectedAgentId) {
      onAgentMove(agentId, zone.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card
      className={cn(
        "w-32 h-32 p-3 transition-all duration-300 hover:shadow-lg cursor-pointer",
        "border-2 relative overflow-hidden",
        zoneTypeColors[zone.type],
        isMoving && "animate-pulse"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Zone Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{zoneTypeIcons[zone.type]}</span>
        <Badge variant="secondary" className="text-xs">
          {agents.length}/{zone.capacity}
        </Badge>
      </div>

      {/* Zone Name */}
      <h3 className="text-xs font-medium text-gray-700 mb-2 truncate">
        {zone.name}
      </h3>

      {/* Agents */}
      <div className="grid grid-cols-2 gap-1">
        {agents.slice(0, 4).map((agent) => (
          <AgentAvatar
            key={agent.id}
            agent={agent}
            isSelected={agent.id === selectedAgentId}
            onClick={() => onAgentSelect(agent.id)}
            size="sm"
            showTooltip
          />
        ))}
        {agents.length > 4 && (
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
            +{agents.length - 4}
          </div>
        )}
      </div>

      {/* Zone Type Badge */}
      <div className="absolute bottom-1 right-1">
        <Badge variant="outline" className="text-xs capitalize">
          {zone.type}
        </Badge>
      </div>
    </Card>
  );
};
