import { cn } from "@/lib/utils";
import { Building } from "../types";

interface BuildingTileProps {
  building: Building;
  tileSize: number;
}

export function BuildingTile({ building, tileSize }: BuildingTileProps) {
  return (
    <div
      className={cn(
        "absolute rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer flex flex-col items-center justify-center gap-1",
        building.color
      )}
      style={{
        left: `${building.position.x * tileSize}px`,
        top: `${building.position.y * tileSize}px`,
        width: `${building.size.width * tileSize}px`,
        height: `${building.size.height * tileSize}px`,
      }}
    >
      <span className="text-2xl filter drop-shadow-sm">{building.icon}</span>
      <span className="text-xs font-medium text-foreground/80 text-center px-1 truncate w-full">
        {building.name}
      </span>
    </div>
  );
}
