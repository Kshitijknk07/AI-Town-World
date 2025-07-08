import React from "react";
import { Agent } from "@/types/agent";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  agent: Agent;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  draggable?: boolean;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

const statusIndicators = {
  idle: "border-green-400",
  moving: "border-blue-400 animate-pulse",
  talking: "border-yellow-400 animate-bounce",
  thinking: "border-purple-400 animate-pulse",
};

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

  const avatarElement = (
    <Avatar
      className={cn(
        sizeClasses[size],
        "cursor-pointer transition-all duration-200 border-2",
        statusIndicators[agent.status],
        isSelected && "ring-4 ring-blue-200 ring-offset-2",
        "hover:scale-110 hover:shadow-lg"
      )}
      onClick={onClick}
      draggable={draggable}
      onDragStart={handleDragStart}
      style={{ borderColor: agent.color }}
    >
      <AvatarImage src={agent.avatar} alt={agent.name} />
      <AvatarFallback
        className="text-white font-bold"
        style={{ backgroundColor: agent.color }}
      >
        {agent.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );

  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{avatarElement}</TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{agent.name}</p>
            <p className="text-gray-600">{agent.role}</p>
            <p className="text-xs text-gray-500 capitalize">{agent.status}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return avatarElement;
};
