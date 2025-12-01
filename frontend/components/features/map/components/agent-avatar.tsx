"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Agent } from "../types";
import { useUIStore } from "@/components/store/ui-store";

interface AgentAvatarProps {
  agent: Agent;
  tileSize: number;
}

export function AgentAvatar({ agent, tileSize }: AgentAvatarProps) {
  const { selectedAgentId, setSelectedAgentId } = useUIStore();
  const isSelected = selectedAgentId === agent.id;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAgentId(isSelected ? null : agent.id);
            }}
            className={cn(
              "absolute transition-all duration-500 ease-in-out z-10 cursor-pointer hover:scale-110 hover:z-20 flex flex-col items-center",
              isSelected && "z-30 scale-110"
            )}
            style={{
              left: `${agent.position.x * tileSize + tileSize / 2 - 16}px`,
              top: `${agent.position.y * tileSize + tileSize / 2 - 16}px`,
            }}
          >
            <div
              className={cn(
                "relative rounded-full transition-all duration-300",
                isSelected
                  ? "ring-4 ring-primary ring-opacity-50 shadow-lg"
                  : "hover:ring-2 hover:ring-primary/30"
              )}
            >
              <Avatar className={cn("h-8 w-8 border-2 border-background shadow-sm", agent.color)}>
                <AvatarFallback className="bg-transparent text-white text-sm select-none">
                  {agent.avatar}
                </AvatarFallback>
              </Avatar>

              {/* Status Indicator */}
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-background"></span>
              </span>
            </div>

            {/* Name Label (Visible on hover or selection) */}
            <div
              className={cn(
                "mt-1 px-2 py-0.5 bg-background/90 backdrop-blur-sm rounded-full text-[10px] font-medium border shadow-sm transition-opacity duration-200 whitespace-nowrap pointer-events-none",
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            >
              {agent.name}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="flex flex-col gap-1 z-50">
          <p className="font-semibold">{agent.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{agent.status}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
