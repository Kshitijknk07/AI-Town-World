export interface Position {
  x: number;
  y: number;
}

export interface Building {
  id: string;
  name: string;
  type: "home" | "shop" | "park" | "cafe" | "office" | "library";
  position: Position;
  size: { width: number; height: number };
  icon: string;
  color: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  position: Position;
  color: string;
  status: "idle" | "moving" | "working" | "socializing";
}

export interface MapConfig {
  width: number;
  height: number;
  tileSize: number;
}
