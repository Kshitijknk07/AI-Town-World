import React from "react";
import { Agent, Zone } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MiniMapLegendProps {
  zones: Zone[];
  agents: Agent[];
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

  return (
    <div className="w-full lg:w-80 space-y-4">
      {/* Zone Types */}
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

      {/* Agents Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Active Agents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2"
                style={{
                  backgroundColor: agent.color,
                  borderColor: agent.color,
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">
                    {agent.name}
                  </span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {agent.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{agent.role}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Population by Location */}
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
