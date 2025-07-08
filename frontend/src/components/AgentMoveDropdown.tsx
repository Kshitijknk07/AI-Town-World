import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface AgentMoveDropdownProps {
  agentId: string;
  onMove: (newLocation: string) => void;
}

const LOCATIONS = [
  { name: "Park", icon: "🌳" },
  { name: "Gallery", icon: "🖼️" },
  { name: "Library", icon: "📚" },
  { name: "Cafe", icon: "☕" },
  { name: "Plaza", icon: "🏛️" },
  { name: "Workshop", icon: "🛠️" },
];

export function AgentMoveDropdown({ onMove }: AgentMoveDropdownProps) {
  return (
    <Select onValueChange={onMove}>
      <SelectTrigger className="mt-4 w-full bg-blue-800 text-white border-blue-400">
        <MapPin className="mr-2 h-4 w-4 text-yellow-300" />
        <SelectValue placeholder="Move to..." />
      </SelectTrigger>
      <SelectContent>
        {LOCATIONS.map((loc) => (
          <SelectItem key={loc.name} value={loc.name}>
            <span className="mr-2">{loc.icon}</span>
            {loc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
