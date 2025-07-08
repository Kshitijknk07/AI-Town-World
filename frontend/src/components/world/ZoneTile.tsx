import React, { useState } from "react";
import { Agent, Zone } from "@/types/agent";
import { AgentAvatar } from "./AgentAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Move, MessageCircle, Brain } from "lucide-react";
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
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

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
          <div
            key={agent.id}
            className="relative group"
            onMouseEnter={() => setHoveredAgent(agent.id)}
            onMouseLeave={() => setHoveredAgent(null)}
          >
            <AgentAvatar
              agent={agent}
              isSelected={agent.id === selectedAgentId}
              onClick={() => onAgentSelect(agent.id)}
              size="sm"
              showTooltip
            />

            {/* Agent Actions Dropdown */}
            {hoveredAgent === agent.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-white/80 hover:bg-white"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onAgentSelect(agent.id)}>
                    <Brain className="w-4 h-4 mr-2" />
                    View Memories
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      // Show available zones for movement
                      const otherZones = allAgents
                        .filter((a) => a.id !== agent.id)
                        .map((a) => a.currentLocation)
                        .filter(
                          (loc, index, arr) => arr.indexOf(loc) === index
                        );

                      if (otherZones.length > 0) {
                        const targetZone = otherZones[0];
                        onAgentMove(agent.id, targetZone);
                      }
                    }}
                  >
                    <Move className="w-4 h-4 mr-2" />
                    Move Agent
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      // Find another agent to talk to
                      const otherAgent = allAgents.find(
                        (a) => a.id !== agent.id
                      );
                      if (otherAgent) {
                        onAgentSelect(agent.id);
                        // This will open the memory panel where they can talk
                      }
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Talk to Others
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
