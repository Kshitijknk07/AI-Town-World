import React, { useState, useMemo, useCallback } from "react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Move,
  MessageCircle,
  Brain,
  MapPin,
} from "lucide-react";
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

export const ZoneTile: React.FC<ZoneTileProps> = React.memo(
  ({
    zone,
    agents,
    selectedAgentId,
    allAgents,
    onAgentSelect,
    onAgentMove,
    isMoving,
  }) => {
    const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

    const availableZones = useMemo(() => {
      const zoneIds = [
        "residential-1",
        "residential-2",
        "commercial-1",
        "commercial-2",
        "park-1",
        "park-2",
        "civic-1",
        "civic-2",
        "special-1",
      ];
      return zoneIds.filter((id) => id !== zone.id);
    }, [zone.id]);

    const otherAgents = useMemo(
      () => allAgents.filter((a) => a.id !== selectedAgentId),
      [allAgents, selectedAgentId]
    );

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        const agentId = e.dataTransfer.getData("agent-id");
        if (agentId && agentId !== selectedAgentId) {
          onAgentMove(agentId, zone.id);
        }
      },
      [selectedAgentId, zone.id, onAgentMove]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
    }, []);

    const handleAgentSelect = useCallback(
      (agentId: string) => {
        onAgentSelect(agentId);
      },
      [onAgentSelect]
    );

    const handleMoveAgent = useCallback(
      (agentId: string, targetZoneId: string) => {
        onAgentMove(agentId, targetZoneId);
      },
      [onAgentMove]
    );

    const handleTalkToOthers = useCallback(
      (agentId: string) => {
        const otherAgent = otherAgents.find((a) => a.id !== agentId);
        if (otherAgent) {
          onAgentSelect(agentId);
        }
      },
      [otherAgents, onAgentSelect]
    );

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
        {}
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg">{zoneTypeIcons[zone.type]}</span>
          <Badge variant="secondary" className="text-xs">
            {agents.length}/{zone.capacity}
          </Badge>
        </div>

        {}
        <h3 className="text-xs font-medium text-gray-700 mb-2 truncate">
          {zone.name}
        </h3>

        {}
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
                onClick={() => handleAgentSelect(agent.id)}
                size="sm"
                showTooltip
              />

              {}
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
                    <DropdownMenuItem
                      onClick={() => handleAgentSelect(agent.id)}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      View Memories
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleTalkToOthers(agent.id)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Talk to Others
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Move className="w-4 h-4 mr-2" />
                      Move to...
                      <DropdownMenu>
                        <DropdownMenuContent side="right" className="w-32">
                          {availableZones.map((zoneId) => (
                            <DropdownMenuItem
                              key={zoneId}
                              onClick={() => handleMoveAgent(agent.id, zoneId)}
                              className="text-xs"
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              {zoneId
                                .replace("-", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
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

        {}
        <div className="absolute bottom-1 right-1">
          <Badge variant="outline" className="text-xs capitalize">
            {zone.type}
          </Badge>
        </div>
      </Card>
    );
  }
);

ZoneTile.displayName = "ZoneTile";
