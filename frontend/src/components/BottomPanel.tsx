import React from "react";
import { motion } from "framer-motion";
import { Activity, MessageCircle, User, Users } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";
import EventLog from "./EventLog";
import ChatWindow from "./ChatWindow";
import AgentInfo from "./AgentInfo";
import { RelationshipGraph } from "./RelationshipGraph";

const BottomPanel: React.FC = () => {
  const { ui, setActiveTab } = useSimulationStore();

  const tabs = [
    { id: "events", label: "Events", icon: Activity },
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "agent-info", label: "Agent Info", icon: User },
    { id: "relationships", label: "Relationships", icon: Users },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-64 bg-white/90 backdrop-blur-sm border-t border-border-light/50 flex flex-col"
    >
      {}
      <div className="flex border-b border-border-light/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = ui.activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-text-secondary hover:text-text-primary hover:bg-soft-gray"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {}
      <div className="flex-1 overflow-hidden">
        {ui.activeTab === "events" && <EventLog />}
        {ui.activeTab === "chat" && <ChatWindow />}
        {ui.activeTab === "agent-info" && <AgentInfo />}
        {ui.activeTab === "relationships" && <RelationshipGraph />}
      </div>
    </motion.div>
  );
};

export default BottomPanel;
