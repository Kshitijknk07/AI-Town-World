interface AgentMoveDropdownProps {
  agentId: string;
  onMove: (newLocation: string) => void;
}

const LOCATIONS = ["Park", "Gallery", "Library", "Cafe", "Plaza", "Workshop"];

export function AgentMoveDropdown({ agentId, onMove }: AgentMoveDropdownProps) {
  return (
    <select
      className="mt-4 w-full bg-blue-700 text-white p-2 rounded"
      onChange={(e) => {
        const newLocation = e.target.value;
        if (!newLocation) return;
        onMove(newLocation);
      }}
    >
      <option value="">Move to...</option>
      {LOCATIONS.map((loc) => (
        <option key={loc} value={loc}>
          {loc}
        </option>
      ))}
    </select>
  );
}
