"use client";

import { useRef, useState, useEffect } from "react";
import { BuildingTile } from "./components/building-tile";
import { AgentAvatar } from "./components/agent-avatar";
import { MOCK_BUILDINGS, MOCK_AGENTS } from "./utils/mock-data";

export function TownMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState(64);

  // Responsive tile size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // Calculate tile size based on container width (assuming 12x12 grid for now)
        const width = containerRef.current.clientWidth;
        const calculatedSize = Math.floor(width / 12);
        setTileSize(Math.max(40, Math.min(80, calculatedSize)));
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-dot-pattern rounded-xl border bg-card shadow-sm">
      {/* Grid Background Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: `${tileSize}px ${tileSize}px`,
        }}
      />

      <div ref={containerRef} className="relative w-full h-full p-4">
        <div className="relative w-full h-full">
          {/* Buildings */}
          {MOCK_BUILDINGS.map((building) => (
            <BuildingTile key={building.id} building={building} tileSize={tileSize} />
          ))}

          {/* Agents */}
          {MOCK_AGENTS.map((agent) => (
            <AgentAvatar key={agent.id} agent={agent} tileSize={tileSize} />
          ))}
        </div>
      </div>

      {/* Map Controls (Zoom/Pan placeholders) */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <div className="bg-background/80 backdrop-blur-sm border rounded-md px-2 py-1 text-xs font-mono text-muted-foreground">
          Grid: 12x12
        </div>
      </div>
    </div>
  );
}
