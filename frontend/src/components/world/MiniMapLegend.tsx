import React from "react";
import { Agent, Zone } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Users, 
  MessageCircle, 
  Shuffle, 
  Activity,
  MapPin,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

const statusColors = {
  idle: "bg-emerald-100 text-emerald-700 border-emerald-200",
  moving: "bg-blue-100 text-blue-700 border-blue-200",
  talking: "bg-yellow-100 text-yellow-700 border-yellow-200",
  thinking: "bg-purple-100 text-purple-700 border-purple-200",
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
        setTimeout(() => {
          onAgentMove(agent.id, randomZone.id);
        }, Math.random() * 2000);
      }
    });
  };

  const handleViewAllMemories = () => {
    if (!onAgentSelect || agents.length === 0) return;
    onAgentSelect(agents[0].id);
  };

  const statusCounts = {
    idle: agents.filter((a) => a.status === "idle").length,
    moving: agents.filter((a) => a.status === "moving").length,
    talking: agents.filter((a) => a.status === "talking").length,
    thinking: agents.filter((a) => a.status === "thinking").length,
  };

  return (
    <div className="w-full space-y-6 sticky top-6">
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-effect border-white/30 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-gray-800">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-indigo-500" />
              </motion.div>
              Control Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full hover-lift glass-effect border-white/50"
              onClick={handleRandomMove}
            >
              <Shuffle className="w-4 h-4 mr-2 text-blue-500" />
              Shuffle All Agents
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full hover-lift glass-effect border-white/50"
              onClick={handleViewAllMemories}
            >
              <Users className="w-4 h-4 mr-2 text-purple-500" />
              Explore Memories
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full hover-lift glass-effect border-white/50"
              onClick={() => {
                if (agents.length >= 2) {
                  onAgentSelect?.(agents[0].id);
                }
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
              Start Conversations
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-effect border-white/30 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-gray-800">
              <Activity className="w-6 h-6 text-emerald-500" />
              Live Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <motion.div
                  key={status}
                  className={cn(
                    "p-3 rounded-xl border text-center",
                    statusColors[status as keyof typeof statusColors]
                  )}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs capitalize font-medium">{status}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Zone Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-effect border-white/30 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-gray-800">
              <MapPin className="w-6 h-6 text-blue-500" />
              Zone Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(zoneTypeCounts).map(([type, count]) => (
              <motion.div 
                key={type} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 transition-colors"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="flex items-center gap-3">
                  <motion.span 
                    className="text-xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {zoneTypeIcons[type as keyof typeof zoneTypeIcons]}
                  </motion.span>
                  <span className="capitalize text-sm font-medium text-gray-700">
                    {type}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-white/80">
                  {count}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Agents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-effect border-white/30 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-gray-800">
              <Users className="w-6 h-6 text-purple-500" />
              Town Residents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-white/50 p-3 rounded-xl transition-all duration-200 group"
                onClick={() => onAgentSelect?.(agent.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                    style={{
                      backgroundColor: agent.color,
                      borderColor: agent.color,
                    }}
                  >
                    {agent.name.charAt(0)}
                  </div>
                  <div
                    className={cn(
                      "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                      statusColors[agent.status].split(' ')[0].replace('bg-', 'bg-').replace('-100', '-400')
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {agent.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs capitalize ml-2",
                        statusColors[agent.status]
                      )}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 truncate font-medium">
                    {agent.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Population Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-effect border-white/30 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3 text-gray-800">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              Population Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(agentsByLocation).map(([location, count]) => (
              <motion.div 
                key={location} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 transition-colors"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-sm font-medium truncate text-gray-700">
                  {location}
                </span>
                <Badge variant="secondary" className="bg-white/80">
                  {count}
                </Badge>
              </motion.div>
            ))}
            <Separator className="my-3 bg-white/30" />
            <div className="flex items-center justify-between font-semibold p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <span className="text-sm text-gray-800">Total Population</span>
              <Badge className="bg-indigo-500 text-white">
                {agents.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};