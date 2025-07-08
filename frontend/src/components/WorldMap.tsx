import type { Agent } from "../types/agent";
import { Zone } from "./Zone";
import { motion } from "framer-motion";
import { useRef, useLayoutEffect, useState } from "react";

const ZONES = ["Park", "Gallery", "Library", "Cafe", "Plaza", "Workshop"];
const ZONE_EMOJIS: Record<string, string> = {
  Park: "🌳",
  Gallery: "🖼️",
  Library: "📚",
  Cafe: "☕",
  Plaza: "🏛️",
  Workshop: "🛠️",
};

interface ConversationEvent {
  fromId: string;
  toId: string;
  timestamp: number;
}

interface WorldMapProps {
  agents: Agent[];
  selectedAgentId?: string | null;
  onAgentClick?: (agent: Agent) => void;
  lastConversation?: ConversationEvent | null;
}

export function WorldMap({
  agents,
  selectedAgentId,
  onAgentClick,
  lastConversation,
}: WorldMapProps) {
  // Group agents by location
  const agentsByZone: Record<string, Agent[]> = {};
  ZONES.forEach((zone) => {
    agentsByZone[zone] = [];
  });
  agents.forEach((agent) => {
    if (ZONES.includes(agent.location)) {
      agentsByZone[agent.location].push(agent);
    }
  });

  // For chat animation: get zone DOM positions
  const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [zoneCenters, setZoneCenters] = useState<{
    [zone: string]: { x: number; y: number };
  }>({});

  useLayoutEffect(() => {
    const centers: { [zone: string]: { x: number; y: number } } = {};
    zoneRefs.current.forEach((el, i) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        centers[ZONES[i]] = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    });
    setZoneCenters(centers);
  }, [agents]);

  // Find from/to zones for chat animation
  let chatFrom: string | null = null;
  let chatTo: string | null = null;
  if (lastConversation) {
    const fromAgent = agents.find((a) => a.id === lastConversation.fromId);
    const toAgent = agents.find((a) => a.id === lastConversation.toId);
    chatFrom = fromAgent?.location || null;
    chatTo = toAgent?.location || null;
  }

  // Find selected zone (if any)
  let selectedZone: string | null = null;
  if (selectedAgentId) {
    const selectedAgent = agents.find((a) => a.id === selectedAgentId);
    selectedZone = selectedAgent?.location || null;
  }

  return (
    <motion.div
      className="mb-8 flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 80 }}
    >
      <MiniMapLegend agentsByZone={agentsByZone} selectedZone={selectedZone} />
      <motion.h2
        className="text-2xl font-bold mb-6 text-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      >
        🗺️ AI Town Map
      </motion.h2>
      <motion.div
        className="bg-green-50 border border-green-200 rounded-3xl p-8 shadow-lg flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 80 }}
      >
        <motion.div
          className="grid grid-cols-2 grid-rows-3 gap-8 relative"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {ZONES.map((zone, i) => (
            <motion.div
              key={zone}
              ref={(el) => {
                zoneRefs.current[i] = el;
              }}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 0 4px #fde68a" }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <Zone
                name={zone}
                agents={agentsByZone[zone]}
                selectedAgentId={selectedAgentId}
                onAgentClick={onAgentClick}
              />
            </motion.div>
          ))}
          {/* Animated chat bubble/line */}
          {chatFrom &&
            chatTo &&
            zoneCenters[chatFrom] &&
            zoneCenters[chatTo] && (
              <ChatBubbleLine
                from={zoneCenters[chatFrom]}
                to={zoneCenters[chatTo]}
                key={lastConversation?.timestamp}
              />
            )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function MiniMapLegend({
  agentsByZone,
  selectedZone,
}: {
  agentsByZone: Record<string, Agent[]>;
  selectedZone: string | null;
}) {
  return (
    <div className="flex gap-3 mb-4 px-4 py-2 bg-white/80 border border-gray-200 rounded-full shadow items-center">
      {ZONES.map((zone) => (
        <motion.div
          key={zone}
          className={`flex flex-col items-center px-2 ${
            selectedZone === zone
              ? "scale-110 bg-yellow-100 border-yellow-400 border-2 shadow-lg"
              : ""
          } rounded-full transition-all`}
          animate={{ scale: selectedZone === zone ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-lg mb-0.5">{ZONE_EMOJIS[zone]}</span>
          <span className="text-xs text-gray-700 font-semibold">{zone}</span>
          <motion.span
            key={agentsByZone[zone].length}
            className="text-xs font-bold text-blue-700 mt-0.5"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {agentsByZone[zone].length}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

// Chat bubble/line animation component
function ChatBubbleLine({
  from,
  to,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
}) {
  // Get relative positions to the grid container
  const svgRef = useRef<SVGSVGElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useLayoutEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setOffset({ x: rect.left, y: rect.top });
    }
  }, []);
  const x1 = from.x - offset.x;
  const y1 = from.y - offset.y;
  const x2 = to.x - offset.x;
  const y2 = to.y - offset.y;
  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute left-0 top-0 w-full h-full z-20"
      style={{ overflow: "visible" }}
    >
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#facc15"
        strokeWidth={4}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        strokeLinecap="round"
      />
      <motion.circle
        cx={x2}
        cy={y2}
        r={18}
        fill="#fef08a"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      />
      <motion.text
        x={x2}
        y={y2 + 5}
        textAnchor="middle"
        fontSize={16}
        fill="#92400e"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        💬
      </motion.text>
    </svg>
  );
}
