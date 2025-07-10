import React, { useEffect, useState } from "react";
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
import TutorialModal from "./components/TutorialModal";
import { useWebSocket } from "./hooks/useWebSocket";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(_error: Error, _errorInfo: any) {}
  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-50">
          <div className="text-4xl mb-4 text-red-600">Something went wrong</div>
          <div className="text-lg text-red-500 mb-2">
            {this.state.error.message}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  useWebSocket();
  const { isRunning, selectedAgentId, agents, ui, advanceTime, fetchAgents } =
    useSimulationStore();

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      advanceTime(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, advanceTime]);

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <ErrorBoundary>
      {}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none"
        onClick={() => setShowTutorial(true)}
        title="Show Tutorial"
        aria-label="Show Tutorial"
      >
        ?
      </button>
      <TutorialModal
        open={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <TownMap />

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

          <TimeControls />
        </div>
      </div>

      <BottomPanel />

      {ui.showMemoryViewer && <MemoryViewer />}
      {ui.showDevTools && <DevTools />}
    </ErrorBoundary>
  );
}

export default App;
