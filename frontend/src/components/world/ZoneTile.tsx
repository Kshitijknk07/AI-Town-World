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
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  residential: "from-emerald-100 to-green-200 border-emerald-300",
  commercial: "from-blue-100 to-indigo-200 border-blue-300",
  park: "from-green-100 to-emerald-200 border-green-300",
  civic: "from-purple-100 to-violet-200 border-purple-300",
  special: "from-yellow-100 to-amber-200 border-yellow-300",
};

const zoneTypeIcons = {
  residential: "🏠",
  commercial: "🏪",
  park: "🌳",
  civic: "🏛️",
  special: "⭐",
};

const zoneTypeGradients = {
  residential: "bg-gradient-to-br from-emerald-400/20 to-green-500/20",
  commercial: "bg-gradient-to-br from-blue-400/20 to-indigo-500/20",
  park: "bg-gradient-to-br from-green-400/20 to-emerald-500/20",
  civic: "bg-gradient-to-br from-purple-400/20 to-violet-500/20",
  special: "bg-gradient-to-br from-yellow-400/20 to-amber-500/20",
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
    const [isDragOver, setIsDragOver] = useState(false);

    const availableZones = useMemo(() => {
      const zoneIds = [
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
      return zoneIds.filter((id) => id !== zone.id);
    }, [zone.id]);

    const otherAgents = useMemo(
      () => allAgents.filter((a) => a.id !== selectedAgentId),
      [allAgents, selectedAgentId]
    );

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const agentId = e.dataTransfer.getData("agent-id");
        if (agentId && agentId !== selectedAgentId) {
          onAgentMove(agentId, zone.id);
        }
      },
      [selectedAgentId, zone.id, onAgentMove]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
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

    const occupancyPercentage = (agents.length / zone.capacity) * 100;
    const isNearCapacity = occupancyPercentage > 80;
    const isFull = agents.length >= zone.capacity;

    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card
          className={cn(
            "w-48 h-48 p-4 transition-all duration-500 cursor-pointer relative overflow-hidden",
            "border-2 shadow-lg hover:shadow-2xl",
            "bg-gradient-to-br",
            zoneTypeColors[zone.type],
            isMoving && "animate-pulse",
            isDragOver && "ring-4 ring-indigo-400 ring-opacity-50 scale-105",
            isFull && "ring-2 ring-red-400"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Background Pattern */}
          <div className={cn(
            "absolute inset-0 opacity-30",
            zoneTypeGradients[zone.type]
          )} />
          
          {/* Sparkle Effect for Special Zones */}
          {zone.type === "special" && (
            <motion.div
              className="absolute top-2 right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </motion.div>
          )}

          <CardContent className="p-0 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <motion.span 
                className="text-2xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {zoneTypeIcons[zone.type]}
              </motion.span>
              <Badge 
                variant={isFull ? "destructive" : isNearCapacity ? "secondary" : "outline"} 
                className={cn(
                  "text-xs font-medium",
                  isFull && "animate-pulse"
                )}
              >
                {agents.length}/{zone.capacity}
              </Badge>
            </div>

            {/* Zone Name */}
            <motion.h3 
              className="text-sm font-semibold text-gray-800 mb-3 truncate leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {zone.name}
            </motion.h3>

            {/* Agents Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {agents.slice(0, 6).map((agent, index) => (
                <motion.div
                  key={agent.id}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
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

                  {/* Quick Actions Menu */}
                  {hoveredAgent === agent.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -top-1 -right-1 z-20"
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-6 h-6 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full"
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 glass-effect">
                          <DropdownMenuItem
                            onClick={() => handleAgentSelect(agent.id)}
                            className="cursor-pointer"
                          >
                            <Brain className="w-4 h-4 mr-2 text-purple-500" />
                            View Memories
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleTalkToOthers(agent.id)}
                            className="cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                            Start Conversation
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center w-full px-2 py-1.5 text-sm hover:bg-accent rounded-sm cursor-pointer">
                              <Move className="w-4 h-4 mr-2 text-green-500" />
                              Move to...
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" className="w-40 glass-effect">
                              {availableZones.map((zoneId) => (
                                <DropdownMenuItem
                                  key={zoneId}
                                  onClick={() => handleMoveAgent(agent.id, zoneId)}
                                  className="text-xs cursor-pointer"
                                >
                                  <MapPin className="w-3 h-3 mr-2" />
                                  {zoneId
                                    .replace("-", " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  )}
                </motion.div>
              ))}
              
              {/* Overflow Indicator */}
              {agents.length > 6 && (
                <motion.div 
                  className="w-8 h-8 bg-gray-200/80 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  +{agents.length - 6}
                </motion.div>
              )}
            </div>

            {/* Zone Type Badge */}
            <div className="absolute bottom-2 right-2">
              <Badge 
                variant="outline" 
                className="text-xs capitalize bg-white/80 backdrop-blur-sm border-white/50"
              >
                {zone.type}
              </Badge>
            </div>

            {/* Capacity Warning */}
            {isFull && (
              <motion.div
                className="absolute top-1 left-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge variant="destructive" className="text-xs">
                  Full
                </Badge>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

ZoneTile.displayName = "ZoneTile";