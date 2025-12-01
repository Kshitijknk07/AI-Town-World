"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { TownMap } from "@/components/features/map/town-map";
import { AgentDetailPanel } from "@/components/features/agents/agent-detail-panel";
import { useUIStore } from "@/components/store/ui-store";
import { cn } from "@/lib/utils";

export default function Home() {
  const { selectedAgentId } = useUIStore();

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <header className="flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shrink-0 z-10">
        <SidebarTrigger />
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-lg tracking-tight">Town Map</span>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex">
          {/* Map Visualization Area */}
          <div
            className={cn(
              "flex-1 h-full transition-all duration-300 ease-in-out p-4",
              selectedAgentId ? "mr-[400px]" : "mr-0"
            )}
          >
            <TownMap />
          </div>

          {/* Sliding Agent Detail Panel */}
          <div
            className={cn(
              "absolute top-0 right-0 bottom-0 w-[400px] border-l bg-background shadow-xl transition-transform duration-300 ease-in-out z-20",
              selectedAgentId ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="h-full p-4">
              <AgentDetailPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
