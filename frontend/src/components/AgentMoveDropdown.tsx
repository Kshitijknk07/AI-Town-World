import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

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
      <SelectTrigger className="mt-4 w-full bg-blue-100 text-blue-900 border-blue-300 font-semibold shadow hover:bg-blue-200 transition-all">
        <MapPin className="mr-2 h-4 w-4 text-yellow-400" />
        <SelectValue placeholder="Move to..." />
      </SelectTrigger>
      <SelectContent asChild>
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {LOCATIONS.map((loc) => (
            <SelectItem
              key={loc.name}
              value={loc.name}
              className="flex items-center gap-2 text-base hover:bg-yellow-100 cursor-pointer"
            >
              <span className="mr-2">{loc.icon}</span>
              {loc.name}
            </SelectItem>
          ))}
        </motion.ul>
      </SelectContent>
    </Select>
  );
}
