import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";
import { formatTime } from "../utils";

const ChatWindow: React.FC = () => {
  const { selectedAgentId, agents, chatMessages, addChatMessage } =
    useSimulationStore();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);
  const messages = selectedAgentId ? chatMessages[selectedAgentId] || [] : [];

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedAgentId) return;
    setLoading(true);
    setError(null);
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
    try {
      const res = await fetch(`/api/agents/${selectedAgentId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage.content }),
      });
      if (!res.ok) throw new Error("Failed to get agent response");
      const data = await res.json();
      const response = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date(),
        agentId: selectedAgentId,
        agentName: selectedAgent?.name || "Unknown",
        content: data.message || "(No response)",
        type: "agent" as const,
      };
      addChatMessage(selectedAgentId, response);
    } catch (err) {
      setError("Could not get agent response. Please try again.");
      const errorMsg = {
        id: (Date.now() + 2).toString(),
        timestamp: new Date(),
        agentId: selectedAgentId,
        agentName: selectedAgent?.name || "Unknown",
        content: "[Error: Could not get agent response]",
        type: "agent" as const,
      };
      addChatMessage(selectedAgentId, errorMsg);
    } finally {
      setLoading(false);
    }
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
        {loading && (
          <div className="text-center text-primary py-2 animate-pulse">
            <span className="inline-block w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin align-middle mr-2" />
            Waiting for agent response...
          </div>
        )}
        {error && <div className="text-center text-red-500 py-2">{error}</div>}
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
            disabled={loading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!message.trim() || loading}
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
