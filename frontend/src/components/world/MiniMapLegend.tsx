import React from "react";
import { Agent, Zone } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Play, Users, MessageCircle, Shuffle } from "lucide-react";

interface MiniMapLegendProps {
  zones: Zone[];
  agents: Agent[];
  onAgentSelect?: (agentId: string) => void;
  onAgentMove?: (agentId: string, targetZoneId: string) => void;
}

const zoneTypeIcons = {
  residential: "🏠",
  commercial: "🏪",
  park: "🌳",
  civic: "🏛️",
  special: "⭐",
};

export const MiniMapLegend: React.FC<MiniMapLegendProps> = ({
  zones,
  agents,
  onAgentSelect,
  onAgentMove,
}) => {
  const zoneTypeCounts = zones.reduce((acc, zone) => {
    acc[zone.type] = (acc[zone.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const agentsByLocation = agents.reduce((acc, agent) => {
    const zone = zones.find((z) => z.id === agent.currentLocation);
    if (zone) {
      acc[zone.name] = (acc[zone.name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleRandomMove = () => {
    if (!onAgentMove) return;

    agents.forEach((agent) => {
      const availableZones = zones.filter(
        (z) => z.id !== agent.currentLocation
      );
      if (availableZones.length > 0) {
        const randomZone =
          availableZones[Math.floor(Math.random() * availableZones.length)];
        onAgentMove(agent.id, randomZone.id);
      }
    });
  };

  const handleViewAllMemories = () => {
    if (!onAgentSelect || agents.length === 0) return;
    onAgentSelect(agents[0].id);
  };

  const statusColors = {
    idle: "bg-gray-200",
    moving: "bg-blue-200",
    talking: "bg-yellow-200",
  };

  return (
    <div className="w-full lg:w-80 space-y-4">
      {}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleRandomMove}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Move All Agents
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleViewAllMemories}
          >
            <Users className="w-4 h-4 mr-2" />
            View All Memories
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              if (agents.length >= 2) {
                onAgentSelect?.(agents[0].id);
              }
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Conversations
          </Button>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Zone Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(zoneTypeCounts).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {zoneTypeIcons[type as keyof typeof zoneTypeIcons]}
                </span>
                <span className="capitalize text-sm font-medium">{type}</span>
              </div>
              <Badge variant="secondary">{count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Active Agents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {}
          <div className="flex gap-2 mb-3">
            {Object.entries({
              idle: agents.filter((a) => a.status === "idle").length,
              moving: agents.filter((a) => a.status === "moving").length,
              talking: agents.filter((a) => a.status === "talking").length,
            }).map(([status, count]) => (
              <div key={status} className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    statusColors[status as keyof typeof statusColors]
                  }`}
                />
                <span className="text-xs capitalize">
                  {status}: {count}
                </span>
              </div>
            ))}
          </div>

          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={() => onAgentSelect?.(agent.id)}
            >
              <div className="relative">
                <div
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    backgroundColor: agent.color,
                    borderColor: agent.color,
                  }}
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white ${
                    statusColors[agent.status]
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">
                    {agent.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize ${
                      agent.status === "moving"
                        ? "border-blue-400 text-blue-600"
                        : agent.status === "talking"
                        ? "border-yellow-400 text-yellow-600"
                        : "border-green-400 text-green-600"
                    }`}
                  >
                    {agent.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{agent.role}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Population Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(agentsByLocation).map(([location, count]) => (
            <div key={location} className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">{location}</span>
              <Badge variant="secondary">{count}</Badge>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex items-center justify-between font-medium">
            <span className="text-sm">Total Agents</span>
            <Badge>{agents.length}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
