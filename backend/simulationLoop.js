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

  async initialize() {
    try {
      await worldTime.initialize();

      await this.loadAgents();

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

  start() {
    if (this.isRunning) {
      logger.warn("Simulation loop already running");
      return;
    }

    this.isRunning = true;
    this.lastTickTime = Date.now();

    this.simulationInterval = setInterval(() => {
      this.tick();
    }, config.simulation.tickInterval);

    logger.info("Simulation loop started", {
      tickInterval: config.simulation.tickInterval,
      agentCount: this.agentIds.length,
    });
  }

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

  async tick() {
    if (!this.isRunning || !worldTime.isRunning) {
      return;
    }

    try {
      const tickStart = Date.now();

      await this.processAgents();

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

  async processAgents() {
    if (this.agentIds.length === 0) {
      return;
    }

    const agentId = this.agentIds[this.currentAgentIndex];

    try {
      await agentThinker.think(agentId);
    } catch (error) {
      logger.error("Failed to process agent", {
        agentId,
        error: error.message,
      });
    }

    this.currentAgentIndex =
      (this.currentAgentIndex + 1) % this.agentIds.length;
  }

  async performMaintenance() {
    try {
      const currentDay = worldTime.day;
      if (currentDay % 1 === 0) {
        await this.cleanupOldMemories();
      }

      if (this.currentAgentIndex === 0) {
        await this.loadAgents();
      }
    } catch (error) {
      logger.error("Maintenance failed", { error: error.message });
    }
  }

  async cleanupOldMemories() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(
        cutoffDate.getDate() - config.simulation.memoryRetentionDays
      );

      await query("DELETE FROM memories WHERE timestamp < $1", [cutoffDate]);

      for (const agentId of this.agentIds) {
      }

      logger.info("Cleaned up old memories", { cutoffDate });
    } catch (error) {
      logger.error("Failed to cleanup old memories", { error: error.message });
    }
  }

  async addAgent(agentId) {
    if (!this.agentIds.includes(agentId)) {
      this.agentIds.push(agentId);
      logger.info("Agent added to simulation", { agentId });
    }
  }

  async removeAgent(agentId) {
    const index = this.agentIds.indexOf(agentId);
    if (index > -1) {
      this.agentIds.splice(index, 1);

      if (this.currentAgentIndex >= this.agentIds.length) {
        this.currentAgentIndex = 0;
      }

      logger.info("Agent removed from simulation", { agentId });
    }
  }

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

  async pause() {
    this.stop();
    worldTime.stop();
    logger.info("Simulation paused");
  }

  async resume() {
    this.start();
    worldTime.start();
    logger.info("Simulation resumed");
  }

  async reset() {
    this.stop();
    await worldTime.reset();
    await this.loadAgents();
    this.start();
    logger.info("Simulation reset");
  }

  async setSpeed(speed) {
    await worldTime.setSpeed(speed);
    logger.info("Simulation speed changed", { speed });
  }

  async getStatistics() {
    try {
      const stats = {
        agents: this.agentIds.length,
        events: 0,
        memories: 0,
        worldTime: worldTime.getFormattedTime(),
      };

      const eventResult = await query("SELECT COUNT(*) as count FROM events");
      stats.events = parseInt(eventResult.rows[0].count);

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

  cleanup() {
    this.stop();
    worldTime.cleanup();
    logger.info("Simulation loop cleanup completed");
  }
}

export default new SimulationLoop();
