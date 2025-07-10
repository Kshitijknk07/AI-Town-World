import React from "react";
import { motion } from "framer-motion";
import { Play, Pause, FastForward, RotateCcw } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";

const timePresets = [
  { label: "Morning", hour: 8, minute: 0 },
  { label: "Afternoon", hour: 14, minute: 0 },
  { label: "Night", hour: 22, minute: 0 },
];

function setTimeOfDay(hour: number, minute: number) {
  fetch("/api/world/set-time", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hour, minute }),
  });
}

const TimeControls: React.FC = () => {
  const { time, isRunning, setSimulationSpeed } = useSimulationStore();

  const speedOptions = [
    { value: "pause", label: "Pause", icon: Pause },
    { value: "slow", label: "Slow", icon: Play },
    { value: "normal", label: "Normal", icon: Play },
    { value: "fast", label: "Fast", icon: FastForward },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/90 backdrop-blur-sm border-t border-border-light/50 px-6 py-4"
    >
      {}
      <div className="flex gap-2 mb-2">
        {timePresets.map((preset) => (
          <button
            key={preset.label}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setTimeOfDay(preset.hour, preset.minute)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        {}
        <div className="flex items-center space-x-2">
          {speedOptions.map((option) => {
            const Icon = option.icon;
            const isActive = time.speed === option.value;

            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSimulationSpeed(option.value as any)}
                className={`time-control flex items-center space-x-2 ${
                  isActive ? "bg-primary" : "bg-time-controls"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{option.label}</span>
              </motion.button>
            );
          })}
        </div>

        {}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isRunning ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-text-secondary">
              {isRunning ? "Running" : "Paused"}
            </span>
          </div>

          <div className="text-sm text-text-secondary">
            Speed:{" "}
            {time.speed === "pause"
              ? "0x"
              : time.speed === "slow"
              ? "0.5x"
              : time.speed === "normal"
              ? "1x"
              : "3x"}
          </div>
        </div>

        {}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-soft-gray text-text-secondary hover:bg-lavender-accent transition-colors"
          title="Reset Simulation"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TimeControls;
