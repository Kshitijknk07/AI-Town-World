import React from "react";
import { Agent } from "@/types/agent";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AgentAvatarProps {
  agent: Agent;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  draggable?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-20 h-20",
};

const statusIndicators = {
  idle: "border-emerald-400 shadow-emerald-200",
  moving: "border-blue-400 shadow-blue-200 animate-pulse",
  talking: "border-yellow-400 shadow-yellow-200 animate-bounce",
  thinking: "border-purple-400 shadow-purple-200 animate-pulse",
};

const statusColors = {
  idle: "bg-emerald-400",
  moving: "bg-blue-400",
  talking: "bg-yellow-400",
  thinking: "bg-purple-400",
};

const agentColors = [
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#8B5A2B", // Brown
  "#EC4899", // Pink
];

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agent,
  isSelected = false,
  onClick,
  size = "md",
  showTooltip = false,
  draggable = true,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (draggable) {
      e.dataTransfer.setData("agent-id", agent.id);
    }
  };

  // Get consistent color for agent
  const agentColorIndex = agent.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const agentColor = agentColors[agentColorIndex % agentColors.length];

  const avatarElement = (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Avatar
        className={cn(
          sizeClasses[size],
          "cursor-pointer transition-all duration-300 border-3 shadow-lg",
          statusIndicators[agent.status],
          isSelected && "ring-4 ring-indigo-400 ring-offset-2 ring-offset-white",
          "hover:shadow-xl relative z-10"
        )}
        onClick={onClick}
        draggable={draggable}
        onDragStart={handleDragStart}
        style={{ borderColor: agentColor }}
      >
        <AvatarImage src={agent.avatar} alt={agent.name} />
        <AvatarFallback
          className="text-white font-bold text-sm"
          style={{ backgroundColor: agentColor }}
        >
          {agent.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* Status Indicator */}
      <motion.div
        className={cn(
          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
          statusColors[agent.status]
        )}
        animate={agent.status === "moving" ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Selection Glow */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full bg-indigo-400 opacity-20 -z-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );

  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{avatarElement}</TooltipTrigger>
        <TooltipContent className="glass-effect border-white/30">
          <div className="text-sm">
            <p className="font-semibold text-gray-800">{agent.name}</p>
            <p className="text-indigo-600 font-medium">{agent.role}</p>
            <p className="text-xs text-gray-500 capitalize mt-1">
              Status: {agent.status}
            </p>
            {agent.backstory && (
              <p className="text-xs text-gray-600 mt-2 max-w-48">
                {agent.backstory.slice(0, 80)}...
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return avatarElement;
};