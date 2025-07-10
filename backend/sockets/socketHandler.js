import { Server } from "socket.io";
import logger from "../utils/logger.js";
import simulationLoop from "../simulationLoop.js";
import worldTime from "../world/time.js";

class SocketHandler {
  constructor() {
    this.io = null;
    this.connectedClients = new Set();
  }

  // Initialize socket.io with the HTTP server
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

  // Setup socket event handlers
  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      this.handleConnection(socket);
    });
  }

  // Handle new client connection
  handleConnection(socket) {
    this.connectedClients.add(socket.id);

    logger.info("Client connected", {
      socketId: socket.id,
      totalClients: this.connectedClients.size,
    });

    // Send initial data
    this.sendInitialData(socket);

    // Handle client disconnection
    socket.on("disconnect", () => {
      this.connectedClients.delete(socket.id);
      logger.info("Client disconnected", {
        socketId: socket.id,
        totalClients: this.connectedClients.size,
      });
    });

    // Handle client joining a room (for specific agent updates)
    socket.on("join:agent", (agentId) => {
      socket.join(`agent:${agentId}`);
      logger.debug("Client joined agent room", {
        socketId: socket.id,
        agentId,
      });
    });

    // Handle client leaving a room
    socket.on("leave:agent", (agentId) => {
      socket.leave(`agent:${agentId}`);
      logger.debug("Client left agent room", { socketId: socket.id, agentId });
    });

    // Handle simulation control
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

    // Handle agent-specific actions
    socket.on("agent:trigger-thought", async (agentId) => {
      try {
        // This would trigger agent thinking
        // await agentThinker.think(agentId);
        logger.info("Agent thought triggered via socket", { agentId });
      } catch (error) {
        logger.error("Failed to trigger agent thought via socket", {
          agentId,
          error: error.message,
        });
      }
    });
  }

  // Send initial data to newly connected client
  async sendInitialData(socket) {
    try {
      // Send simulation status
      const status = simulationLoop.getStatus();
      socket.emit("simulation:status", status);

      // Send world time
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

  // Broadcast to all connected clients
  broadcast(event, data) {
    if (this.io) {
      this.io.emit(event, data);
      logger.debug("Broadcasted event", {
        event,
        dataSize: JSON.stringify(data).length,
      });
    }
  }

  // Broadcast to specific room
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

  // Broadcast agent update
  broadcastAgentUpdate(agent) {
    this.broadcast("agent:update", agent);
    this.broadcastToRoom(`agent:${agent.id}`, "agent:update", agent);
  }

  // Broadcast agent movement
  broadcastAgentMovement(agentId, oldLocation, newLocation) {
    const movementData = {
      agentId,
      oldLocation,
      newLocation,
      timestamp: new Date(),
    };

    this.broadcast("agent:movement", movementData);
  }

  // Broadcast new event
  broadcastEvent(event) {
    this.broadcast("event:new", event);
  }

  // Broadcast world time update
  broadcastWorldTime() {
    const timeData = worldTime.getCurrentTime();
    this.broadcast("world:time", timeData);
  }

  // Broadcast simulation status
  broadcastSimulationStatus() {
    const status = simulationLoop.getStatus();
    this.broadcast("simulation:status", status);
  }

  // Broadcast memory update
  broadcastMemoryUpdate(agentId, memory) {
    this.broadcastToRoom(`agent:${agentId}`, "memory:new", memory);
  }

  // Broadcast chat message
  broadcastChatMessage(agentId, message) {
    this.broadcastToRoom(`agent:${agentId}`, "chat:message", message);
  }

  // Broadcast agent thought
  broadcastAgentThought(agentId, thought) {
    this.broadcastToRoom(`agent:${agentId}`, "agent:thought", {
      agentId,
      thought,
      timestamp: new Date(),
    });
  }

  // Broadcast agent action
  broadcastAgentAction(agentId, action) {
    this.broadcast("agent:action", {
      agentId,
      action,
      timestamp: new Date(),
    });
  }

  // Broadcast relationship update
  broadcastRelationshipUpdate(agentId, targetAgentId, relationship) {
    this.broadcast("relationship:update", {
      agentId,
      targetAgentId,
      relationship,
      timestamp: new Date(),
    });
  }

  // Broadcast building update
  broadcastBuildingUpdate(building) {
    this.broadcast("building:update", building);
  }

  // Broadcast system message
  broadcastSystemMessage(message, type = "info") {
    this.broadcast("system:message", {
      message,
      type,
      timestamp: new Date(),
    });
  }

  // Broadcast error
  broadcastError(error, context = {}) {
    this.broadcast("system:error", {
      error: error.message,
      context,
      timestamp: new Date(),
    });
  }

  // Get connected clients count
  getConnectedClientsCount() {
    return this.connectedClients.size;
  }

  // Get all connected clients
  getConnectedClients() {
    return Array.from(this.connectedClients);
  }

  // Check if client is connected
  isClientConnected(socketId) {
    return this.connectedClients.has(socketId);
  }

  // Send message to specific client
  sendToClient(socketId, event, data) {
    if (this.io && this.isClientConnected(socketId)) {
      this.io.to(socketId).emit(event, data);
      logger.debug("Sent to client", { socketId, event });
    }
  }

  // Disconnect specific client
  disconnectClient(socketId) {
    if (this.io && this.isClientConnected(socketId)) {
      this.io.sockets.sockets.get(socketId).disconnect();
      this.connectedClients.delete(socketId);
      logger.info("Client disconnected by server", { socketId });
    }
  }

  // Disconnect all clients
  disconnectAllClients() {
    if (this.io) {
      this.io.disconnectSockets();
      this.connectedClients.clear();
      logger.info("All clients disconnected");
    }
  }

  // Cleanup
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
