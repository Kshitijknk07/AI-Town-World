import { Server } from "socket.io";
import logger from "../utils/logger.js";
import simulationLoop from "../simulationLoop.js";
import worldTime from "../world/time.js";

class SocketHandler {
  constructor() {
    this.io = null;
    this.connectedClients = new Set();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupEventHandlers();
    logger.info("Socket.io initialized");
  }

  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      this.handleConnection(socket);
    });
  }

  handleConnection(socket) {
    this.connectedClients.add(socket.id);

    logger.info("Client connected", {
      socketId: socket.id,
      totalClients: this.connectedClients.size,
    });

    this.sendInitialData(socket);

    socket.on("disconnect", () => {
      this.connectedClients.delete(socket.id);
      logger.info("Client disconnected", {
        socketId: socket.id,
        totalClients: this.connectedClients.size,
      });
    });

    socket.on("join:agent", (agentId) => {
      socket.join(`agent:${agentId}`);
      logger.debug("Client joined agent room", {
        socketId: socket.id,
        agentId,
      });
    });

    socket.on("leave:agent", (agentId) => {
      socket.leave(`agent:${agentId}`);
      logger.debug("Client left agent room", { socketId: socket.id, agentId });
    });

    socket.on("simulation:start", () => {
      simulationLoop.start();
      this.broadcastSimulationStatus();
    });

    socket.on("simulation:stop", () => {
      simulationLoop.stop();
      this.broadcastSimulationStatus();
    });

    socket.on("simulation:pause", async () => {
      await simulationLoop.pause();
      this.broadcastSimulationStatus();
    });

    socket.on("simulation:resume", async () => {
      await simulationLoop.resume();
      this.broadcastSimulationStatus();
    });

    socket.on("simulation:reset", async () => {
      await simulationLoop.reset();
      this.broadcastSimulationStatus();
    });

    socket.on("world:speed", async (speed) => {
      await worldTime.setSpeed(speed);
      this.broadcastWorldTime();
    });

    socket.on("agent:trigger-thought", async (agentId) => {
      try {
        logger.info("Agent thought triggered via socket", { agentId });
      } catch (error) {
        logger.error("Failed to trigger agent thought via socket", {
          agentId,
          error: error.message,
        });
      }
    });
  }

  async sendInitialData(socket) {
    try {
      const status = simulationLoop.getStatus();
      socket.emit("simulation:status", status);

      const worldTimeData = worldTime.getCurrentTime();
      socket.emit("world:time", worldTimeData);

      logger.debug("Initial data sent to client", { socketId: socket.id });
    } catch (error) {
      logger.error("Failed to send initial data", {
        socketId: socket.id,
        error: error.message,
      });
    }
  }

  broadcast(event, data) {
    if (this.io) {
      this.io.emit(event, data);
      logger.debug("Broadcasted event", {
        event,
        dataSize: JSON.stringify(data).length,
      });
    }
  }

  broadcastToRoom(room, event, data) {
    if (this.io) {
      this.io.to(room).emit(event, data);
      logger.debug("Broadcasted to room", {
        room,
        event,
        dataSize: JSON.stringify(data).length,
      });
    }
  }

  broadcastAgentUpdate(agent) {
    this.broadcast("agent:update", agent);
    this.broadcastToRoom(`agent:${agent.id}`, "agent:update", agent);
  }

  broadcastAgentMovement(agentId, oldLocation, newLocation) {
    const movementData = {
      agentId,
      oldLocation,
      newLocation,
      timestamp: new Date(),
    };

    this.broadcast("agent:movement", movementData);
  }

  broadcastEvent(event) {
    this.broadcast("event:new", event);
  }

  broadcastWorldTime() {
    const timeData = worldTime.getCurrentTime();
    this.broadcast("world:time", timeData);
  }

  broadcastSimulationStatus() {
    const status = simulationLoop.getStatus();
    this.broadcast("simulation:status", status);
  }

  broadcastMemoryUpdate(agentId, memory) {
    this.broadcastToRoom(`agent:${agentId}`, "memory:new", memory);
  }

  broadcastChatMessage(agentId, message) {
    this.broadcastToRoom(`agent:${agentId}`, "chat:message", message);
  }

  broadcastAgentThought(agentId, thought) {
    this.broadcastToRoom(`agent:${agentId}`, "agent:thought", {
      agentId,
      thought,
      timestamp: new Date(),
    });
  }

  broadcastAgentAction(agentId, action) {
    this.broadcast("agent:action", {
      agentId,
      action,
      timestamp: new Date(),
    });
  }

  broadcastRelationshipUpdate(agentId, targetAgentId, relationship) {
    this.broadcast("relationship:update", {
      agentId,
      targetAgentId,
      relationship,
      timestamp: new Date(),
    });
  }

  broadcastBuildingUpdate(building) {
    this.broadcast("building:update", building);
  }

  broadcastSystemMessage(message, type = "info") {
    this.broadcast("system:message", {
      message,
      type,
      timestamp: new Date(),
    });
  }

  broadcastError(error, context = {}) {
    this.broadcast("system:error", {
      error: error.message,
      context,
      timestamp: new Date(),
    });
  }

  getConnectedClientsCount() {
    return this.connectedClients.size;
  }

  getConnectedClients() {
    return Array.from(this.connectedClients);
  }

  isClientConnected(socketId) {
    return this.connectedClients.has(socketId);
  }

  sendToClient(socketId, event, data) {
    if (this.io && this.isClientConnected(socketId)) {
      this.io.to(socketId).emit(event, data);
      logger.debug("Sent to client", { socketId, event });
    }
  }

  disconnectClient(socketId) {
    if (this.io && this.isClientConnected(socketId)) {
      this.io.sockets.sockets.get(socketId).disconnect();
      this.connectedClients.delete(socketId);
      logger.info("Client disconnected by server", { socketId });
    }
  }

  disconnectAllClients() {
    if (this.io) {
      this.io.disconnectSockets();
      this.connectedClients.clear();
      logger.info("All clients disconnected");
    }
  }

  cleanup() {
    if (this.io) {
      this.disconnectAllClients();
      this.io.close();
      this.io = null;
      logger.info("Socket.io cleanup completed");
    }
  }
}

export default new SocketHandler();
