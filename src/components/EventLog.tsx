import React from "react";
import { motion } from "framer-motion";
import { useSimulationStore } from "../store/simulationStore";
import { getEventIcon, getEventColor, formatRelativeTime } from "../utils";

const EventLog: React.FC = () => {
  const { events } = useSimulationStore();

  return (
    <div className="h-full overflow-y-auto p-4 space-y-2">
      {events.length === 0 ? (
        <div className="text-center text-text-secondary py-8">
          <div className="text-4xl mb-2">📝</div>
          <div className="text-sm">No events yet</div>
          <div className="text-xs">
            Events will appear here as agents interact
          </div>
        </div>
      ) : (
        events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-lg border-l-4 ${getEventColor(
              event.importance
            )}`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-lg">{getEventIcon(event.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-text-primary">
                    {event.agentName || "System"}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {formatRelativeTime(event.timestamp)}
                  </div>
                </div>

                <div className="text-sm text-text-secondary">
                  {event.description}
                </div>

                {event.location && (
                  <div className="text-xs text-text-secondary mt-1">
                    📍 {event.location}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default EventLog;
