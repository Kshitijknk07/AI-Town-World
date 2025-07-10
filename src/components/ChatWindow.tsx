import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";
import { formatTime } from "../utils";

const ChatWindow: React.FC = () => {
  const { selectedAgentId, agents, chatMessages, addChatMessage } =
    useSimulationStore();
  const [message, setMessage] = useState("");

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);
  const messages = selectedAgentId ? chatMessages[selectedAgentId] || [] : [];

  const handleSendMessage = () => {
    if (!message.trim() || !selectedAgentId) return;

    const newMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      agentId: selectedAgentId,
      agentName: selectedAgent?.name || "Unknown",
      content: message.trim(),
      type: "user" as const,
    };

    addChatMessage(selectedAgentId, newMessage);
    setMessage("");

    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date(),
        agentId: selectedAgentId,
        agentName: selectedAgent?.name || "Unknown",
        content: `Thanks for your message! I'm currently ${selectedAgent?.currentGoal.toLowerCase()}.`,
        type: "agent" as const,
      };
      addChatMessage(selectedAgentId, response);
    }, 1000);
  };

  if (!selectedAgent) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <div className="text-sm">Select an agent to start chatting</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {}
      <div className="p-4 border-b border-border-light/50 bg-soft-gray">
        <div className="flex items-center space-x-3">
          <div className="agent-avatar text-lg">{selectedAgent.avatar}</div>
          <div>
            <div className="font-medium text-text-primary">
              {selectedAgent.name}
            </div>
            <div className="text-xs text-text-secondary">
              {selectedAgent.currentGoal}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            <div className="text-4xl mb-2">💬</div>
            <div className="text-sm">
              Start a conversation with {selectedAgent.name}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs ${
                  msg.type === "user" ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    msg.type === "user" ? "bg-primary text-white" : ""
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.type === "user"
                        ? "text-white/70"
                        : "text-text-secondary"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {}
      <div className="p-4 border-t border-border-light/50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={`Message ${selectedAgent.name}...`}
            className="flex-1 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
