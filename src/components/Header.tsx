import React from "react";
import { motion } from "framer-motion";
import { Clock, Settings, Brain } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";
import { formatTime, formatDate } from "../utils";

const Header: React.FC = () => {
  const { time, ui, toggleDevTools, toggleMemoryViewer } = useSimulationStore();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/90 backdrop-blur-sm border-b border-border-light/50 px-6 py-4 flex items-center justify-between"
    >
      {}
      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            🏘️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              AI Town World
            </h1>
            <p className="text-sm text-text-secondary">
              Self-contained AI simulation
            </p>
          </div>
        </motion.div>
      </div>

      {}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-soft-gray px-4 py-2 rounded-xl">
          <Clock className="w-4 h-4 text-text-secondary" />
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              {formatTime(time.currentTime)}
            </div>
            <div className="text-xs text-text-secondary">
              {formatDate(time.currentTime)} • Day {time.day}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMemoryViewer}
          className={`p-2 rounded-lg transition-colors ${
            ui.showMemoryViewer
              ? "bg-primary text-white"
              : "bg-soft-gray text-text-secondary hover:bg-lavender-accent"
          }`}
          title="Memory Viewer"
        >
          <Brain className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDevTools}
          className={`p-2 rounded-lg transition-colors ${
            ui.showDevTools
              ? "bg-primary text-white"
              : "bg-soft-gray text-text-secondary hover:bg-lavender-accent"
          }`}
          title="Developer Tools"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
