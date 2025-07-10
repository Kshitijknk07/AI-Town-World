import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSimulationStore } from "../store/simulationStore";

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const updateTime = useSimulationStore((state) => state.updateTime);
  const updateAgent = useSimulationStore((state) => state.updateAgent);
  const addEvent = useSimulationStore((state) => state.addEvent);
  const addChatMessage = useSimulationStore((state) => state.addChatMessage);
  const addMemory = useSimulationStore((state) => state.addMemory);
  const updateRelationship = useSimulationStore(
    (state) => state.updateRelationship
  );
  const updateAgentThought = useSimulationStore(
    (state) => state.updateAgentThought
  );

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("world:time", (data) => {
      updateTime(data);
    });
    socketRef.current.on("agent:update", (data) => {
      if (data && data.id) updateAgent(data.id, data);
    });
    socketRef.current.on("event:new", (data) => {
      addEvent(data);
    });
    socketRef.current.on("chat:message", (data) => {
      if (data && data.agentId && data.message) {
        addChatMessage(data.agentId, data.message);
      }
    });
    socketRef.current.on("memory:new", (data) => {
      if (data && data.agentId && data.memory) {
        addMemory(data.agentId, data.memory);
      }
    });
    socketRef.current.on("relationship:update", (data) => {
      if (
        data &&
        data.agent1 &&
        data.agent2 &&
        data.relationship &&
        typeof data.strength === "number"
      ) {
        updateRelationship(
          data.agent1,
          data.agent2,
          data.relationship,
          data.strength
        );
      }
    });
    socketRef.current.on("agent:thought", (data) => {
      if (data && data.agentId && data.thought) {
        updateAgentThought(data.agentId, data.thought);
      }
    });
    socketRef.current.on("agent:action", (data) => {
      if (data && data.agentId && data.action) {
        addEvent({
          id: `${data.agentId}-${Date.now()}`,
          timestamp: new Date(),
          type: "interaction",
          agentId: data.agentId,
          agentName: data.agentName || "Agent",
          location: data.location || "",
          description: data.action,
          importance: "medium",
        });
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [
    updateTime,
    updateAgent,
    addEvent,
    addChatMessage,
    addMemory,
    updateRelationship,
    updateAgentThought,
  ]);

  return socketRef.current;
}
