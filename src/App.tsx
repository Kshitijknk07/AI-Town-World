import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSimulationStore } from "./store/simulationStore";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TownMap from "./components/TownMap";
import TimeControls from "./components/TimeControls";
import BottomPanel from "./components/BottomPanel";
import AgentCard from "./components/AgentCard";
import MemoryViewer from "./components/MemoryViewer";
import DevTools from "./components/DevTools";

function App() {
  const { isRunning, selectedAgentId, agents, ui, advanceTime } =
    useSimulationStore();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      advanceTime(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, advanceTime]);

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {}
      <Header />

      {}
      <div className="flex-1 flex overflow-hidden">
        {}
        <Sidebar />

        {}
        <div className="flex-1 flex flex-col">
          {}
          <div className="flex-1 relative">
            <TownMap />

            {}
            {selectedAgent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute top-4 right-4 z-10"
              >
                <AgentCard agent={selectedAgent} />
              </motion.div>
            )}
          </div>

          {}
          <TimeControls />
        </div>
      </div>

      {}
      <BottomPanel />

      {}
      {ui.showMemoryViewer && <MemoryViewer />}
      {ui.showDevTools && <DevTools />}
    </div>
  );
}

export default App;
