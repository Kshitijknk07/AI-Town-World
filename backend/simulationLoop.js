import agentThinker from "./agents/thinker.js";
import worldTime from "./world/time.js";
import { query } from "./data/db.js";
import logger from "./utils/logger.js";
import config from "./config/config.js";

class SimulationLoop {
  constructor() {
    this.isRunning = false;
    this.agentIds = [];
    this.currentAgentIndex = 0;
    this.simulationInterval = null;
    this.lastTickTime = Date.now();
  }

  // Initialize simulation
  async initialize() {
    try {
      // Initialize world time
      await worldTime.initialize();

      // Load agent IDs
      await this.loadAgents();

      // Start world time simulation
      if (worldTime.isRunning) {
        worldTime.start();
      }

      logger.info("Simulation loop initialized", {
        agentCount: this.agentIds.length,
        worldTimeRunning: worldTime.isRunning,
      });
    } catch (error) {
      logger.error("Failed to initialize simulation loop", {
        error: error.message,
      });
      throw error;
    }
  }

  // Load agent IDs from database
  async loadAgents() {
    try {
      const result = await query("SELECT id FROM agents ORDER BY created_at");
      this.agentIds = result.rows.map((row) => row.id);

      logger.info("Loaded agents for simulation", {
        count: this.agentIds.length,
      });
    } catch (error) {
      logger.error("Failed to load agents", { error: error.message });
      this.agentIds = [];
    }
  }

  // Start the simulation loop
  start() {
    if (this.isRunning) {
      logger.warn("Simulation loop already running");
      return;
    }

    this.isRunning = true;
    this.lastTickTime = Date.now();

    // Start simulation interval
    this.simulationInterval = setInterval(() => {
      this.tick();
    }, config.simulation.tickInterval);

    logger.info("Simulation loop started", {
      tickInterval: config.simulation.tickInterval,
      agentCount: this.agentIds.length,
    });
  }

  // Stop the simulation loop
  stop() {
    if (!this.isRunning) {
      logger.warn("Simulation loop not running");
      return;
    }

    this.isRunning = false;

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    logger.info("Simulation loop stopped");
  }

  // Main simulation tick
  async tick() {
    if (!this.isRunning || !worldTime.isRunning) {
      return;
    }

    try {
      const tickStart = Date.now();

      // Process agents in round-robin fashion
      await this.processAgents();

      // Perform periodic maintenance
      await this.performMaintenance();

      const tickDuration = Date.now() - tickStart;
      this.lastTickTime = Date.now();

      logger.debug("Simulation tick completed", {
        duration: tickDuration,
        agentCount: this.agentIds.length,
      });
    } catch (error) {
      logger.error("Simulation tick failed", { error: error.message });
    }
  }

  // Process agents for this tick
  async processAgents() {
    if (this.agentIds.length === 0) {
      return;
    }

    // Process one agent per tick to avoid overwhelming the system
    const agentId = this.agentIds[this.currentAgentIndex];

    try {
      await agentThinker.think(agentId);
    } catch (error) {
      logger.error("Failed to process agent", {
        agentId,
        error: error.message,
      });
    }

    // Move to next agent
    this.currentAgentIndex =
      (this.currentAgentIndex + 1) % this.agentIds.length;
  }

  // Perform periodic maintenance tasks
  async performMaintenance() {
    try {
      // Clean up old memories (once per day)
      const currentDay = worldTime.day;
      if (currentDay % 1 === 0) {
        // Every day
        await this.cleanupOldMemories();
      }

      // Reload agents (every 10 ticks)
      if (this.currentAgentIndex === 0) {
        await this.loadAgents();
      }
    } catch (error) {
      logger.error("Maintenance failed", { error: error.message });
    }
  }

  // Clean up old memories
  async cleanupOldMemories() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(
        cutoffDate.getDate() - config.simulation.memoryRetentionDays
      );

      // Clean up from database
      await query("DELETE FROM memories WHERE timestamp < $1", [cutoffDate]);

      // Clean up from vector store
      for (const agentId of this.agentIds) {
        // This would be implemented in the embedding client
        // embeddingClient.cleanupOldMemories(agentId);
      }

      logger.info("Cleaned up old memories", { cutoffDate });
    } catch (error) {
      logger.error("Failed to cleanup old memories", { error: error.message });
    }
  }

  // Add new agent to simulation
  async addAgent(agentId) {
    if (!this.agentIds.includes(agentId)) {
      this.agentIds.push(agentId);
      logger.info("Agent added to simulation", { agentId });
    }
  }

  // Remove agent from simulation
  async removeAgent(agentId) {
    const index = this.agentIds.indexOf(agentId);
    if (index > -1) {
      this.agentIds.splice(index, 1);

      // Adjust current index if needed
      if (this.currentAgentIndex >= this.agentIds.length) {
        this.currentAgentIndex = 0;
      }

      logger.info("Agent removed from simulation", { agentId });
    }
  }

  // Get simulation status
  getStatus() {
    return {
      isRunning: this.isRunning,
      agentCount: this.agentIds.length,
      currentAgentIndex: this.currentAgentIndex,
      lastTickTime: this.lastTickTime,
      worldTime: worldTime.getFormattedTime(),
      uptime: this.isRunning ? Date.now() - this.lastTickTime : 0,
    };
  }

  // Pause simulation
  async pause() {
    this.stop();
    worldTime.stop();
    logger.info("Simulation paused");
  }

  // Resume simulation
  async resume() {
    this.start();
    worldTime.start();
    logger.info("Simulation resumed");
  }

  // Reset simulation
  async reset() {
    this.stop();
    await worldTime.reset();
    await this.loadAgents();
    this.start();
    logger.info("Simulation reset");
  }

  // Set simulation speed
  async setSpeed(speed) {
    await worldTime.setSpeed(speed);
    logger.info("Simulation speed changed", { speed });
  }

  // Get simulation statistics
  async getStatistics() {
    try {
      const stats = {
        agents: this.agentIds.length,
        events: 0,
        memories: 0,
        worldTime: worldTime.getFormattedTime(),
      };

      // Get event count
      const eventResult = await query("SELECT COUNT(*) as count FROM events");
      stats.events = parseInt(eventResult.rows[0].count);

      // Get memory count
      const memoryResult = await query(
        "SELECT COUNT(*) as count FROM memories"
      );
      stats.memories = parseInt(memoryResult.rows[0].count);

      return stats;
    } catch (error) {
      logger.error("Failed to get simulation statistics", {
        error: error.message,
      });
      return null;
    }
  }

  // Cleanup resources
  cleanup() {
    this.stop();
    worldTime.cleanup();
    logger.info("Simulation loop cleanup completed");
  }
}

export default new SimulationLoop();
