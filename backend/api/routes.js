import express from "express";
import { v4 as uuidv4 } from "uuid";
import { query } from "../data/db.js";
import agentThinker from "../agents/thinker.js";
import simulationLoop from "../simulationLoop.js";
import worldTime from "../world/time.js";
import embeddingClient from "../vector/embeddingClient.js";
import ollamaClient from "../llm/ollamaClient.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get("/agents", async (req, res) => {
  try {
    const result = await query("SELECT * FROM agents ORDER BY created_at");
    res.json(result.rows);
  } catch (error) {
    logger.error("Failed to get agents", { error: error.message });
    res.status(500).json({ error: "Failed to get agents" });
  }
});

router.get("/agents/:id", async (req, res) => {
  try {
    const result = await query("SELECT * FROM agents WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error("Failed to get agent", {
      agentId: req.params.id,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to get agent" });
  }
});

router.post("/agents", async (req, res) => {
  try {
    const { name, personality, current_location, current_goal, avatar } =
      req.body;

    if (!name || !personality || !current_location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const agentId = uuidv4();
    const agent = {
      id: agentId,
      name,
      personality,
      current_location,
      current_goal: current_goal || "Explore the town",
      current_thought: "Just arrived in town...",
      energy: 100,
      mood: 0,
      schedule: { wakeTime: "07:00", sleepTime: "22:00", activities: [] },
      avatar: avatar || "👤",
      relationships: {},
      created_at: new Date(),
      updated_at: new Date(),
    };

    await query(
      `INSERT INTO agents (id, name, personality, current_location, current_goal, current_thought, 
        energy, mood, schedule, avatar, relationships, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        agent.id,
        agent.name,
        JSON.stringify(agent.personality),
        agent.current_location,
        agent.current_goal,
        agent.current_thought,
        agent.energy,
        agent.mood,
        JSON.stringify(agent.schedule),
        agent.avatar,
        JSON.stringify(agent.relationships),
        agent.created_at,
        agent.updated_at,
      ]
    );

    await simulationLoop.addAgent(agentId);

    logger.info("Agent created", { agentId, name });
    res.status(201).json(agent);
  } catch (error) {
    logger.error("Failed to create agent", { error: error.message });
    res.status(500).json({ error: "Failed to create agent" });
  }
});

router.put("/agents/:id", async (req, res) => {
  try {
    const {
      name,
      personality,
      current_location,
      current_goal,
      energy,
      mood,
      schedule,
    } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (personality) {
      updates.push(`personality = $${paramIndex++}`);
      values.push(JSON.stringify(personality));
    }
    if (current_location) {
      updates.push(`current_location = $${paramIndex++}`);
      values.push(current_location);
    }
    if (current_goal) {
      updates.push(`current_goal = $${paramIndex++}`);
      values.push(current_goal);
    }
    if (energy !== undefined) {
      updates.push(`energy = $${paramIndex++}`);
      values.push(energy);
    }
    if (mood !== undefined) {
      updates.push(`mood = $${paramIndex++}`);
      values.push(mood);
    }
    if (schedule) {
      updates.push(`schedule = $${paramIndex++}`);
      values.push(JSON.stringify(schedule));
    }

    updates.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());

    values.push(req.params.id);

    const result = await query(
      `UPDATE agents SET ${updates.join(", ")} WHERE id = $${paramIndex}`,
      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }

    logger.info("Agent updated", { agentId: req.params.id });
    res.json({ message: "Agent updated successfully" });
  } catch (error) {
    logger.error("Failed to update agent", {
      agentId: req.params.id,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to update agent" });
  }
});

router.delete("/agents/:id", async (req, res) => {
  try {
    const result = await query("DELETE FROM agents WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }

    await simulationLoop.removeAgent(req.params.id);

    logger.info("Agent deleted", { agentId: req.params.id });
    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete agent", {
      agentId: req.params.id,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to delete agent" });
  }
});

router.post("/agents/:id/thought", async (req, res) => {
  try {
    await agentThinker.think(req.params.id);
    res.json({ message: "Agent thought triggered" });
  } catch (error) {
    logger.error("Failed to trigger agent thought", {
      agentId: req.params.id,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to trigger agent thought" });
  }
});

router.get("/agents/:id/memories", async (req, res) => {
  try {
    const { limit = 10, search } = req.query;

    let memories;
    if (search) {
      memories = await embeddingClient.searchMemories(
        req.params.id,
        search,
        parseInt(limit)
      );
    } else {
      memories = embeddingClient.getRecentMemories(
        req.params.id,
        parseInt(limit)
      );
    }

    res.json(memories);
  } catch (error) {
    logger.error("Failed to get agent memories", {
      agentId: req.params.id,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to get agent memories" });
  }
});

router.get("/world/time", async (req, res) => {
  try {
    const timeState = worldTime.getCurrentTime();
    res.json(timeState);
  } catch (error) {
    logger.error("Failed to get world time", { error: error.message });
    res.status(500).json({ error: "Failed to get world time" });
  }
});

router.post("/world/speed", async (req, res) => {
  try {
    const { speed } = req.body;

    if (!["pause", "slow", "normal", "fast"].includes(speed)) {
      return res.status(400).json({ error: "Invalid speed value" });
    }

    await worldTime.setSpeed(speed);
    res.json({ message: "World time speed updated", speed });
  } catch (error) {
    logger.error("Failed to set world time speed", { error: error.message });
    res.status(500).json({ error: "Failed to set world time speed" });
  }
});

router.post("/world/reset", async (req, res) => {
  try {
    await worldTime.reset();
    res.json({ message: "World time reset" });
  } catch (error) {
    logger.error("Failed to reset world time", { error: error.message });
    res.status(500).json({ error: "Failed to reset world time" });
  }
});

router.get("/world/buildings", async (req, res) => {
  try {
    const result = await query("SELECT * FROM buildings ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    logger.error("Failed to get buildings", { error: error.message });
    res.status(500).json({ error: "Failed to get buildings" });
  }
});

router.get("/events", async (req, res) => {
  try {
    const { limit = 50, agent_id, location } = req.query;

    let queryText = "SELECT * FROM events";
    const params = [];
    const conditions = [];
    let paramIndex = 1;

    if (agent_id) {
      conditions.push(`agent_id = $${paramIndex++}`);
      params.push(agent_id);
    }

    if (location) {
      conditions.push(`location = $${paramIndex++}`);
      params.push(location);
    }

    if (conditions.length > 0) {
      queryText += " WHERE " + conditions.join(" AND ");
    }

    queryText += " ORDER BY timestamp DESC LIMIT $" + paramIndex;
    params.push(parseInt(limit));

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    logger.error("Failed to get events", { error: error.message });
    res.status(500).json({ error: "Failed to get events" });
  }
});

router.get("/simulation/status", async (req, res) => {
  try {
    const status = simulationLoop.getStatus();
    res.json(status);
  } catch (error) {
    logger.error("Failed to get simulation status", { error: error.message });
    res.status(500).json({ error: "Failed to get simulation status" });
  }
});

router.post("/simulation/start", async (req, res) => {
  try {
    simulationLoop.start();
    res.json({ message: "Simulation started" });
  } catch (error) {
    logger.error("Failed to start simulation", { error: error.message });
    res.status(500).json({ error: "Failed to start simulation" });
  }
});

router.post("/simulation/stop", async (req, res) => {
  try {
    simulationLoop.stop();
    res.json({ message: "Simulation stopped" });
  } catch (error) {
    logger.error("Failed to stop simulation", { error: error.message });
    res.status(500).json({ error: "Failed to stop simulation" });
  }
});

router.post("/simulation/pause", async (req, res) => {
  try {
    await simulationLoop.pause();
    res.json({ message: "Simulation paused" });
  } catch (error) {
    logger.error("Failed to pause simulation", { error: error.message });
    res.status(500).json({ error: "Failed to pause simulation" });
  }
});

router.post("/simulation/resume", async (req, res) => {
  try {
    await simulationLoop.resume();
    res.json({ message: "Simulation resumed" });
  } catch (error) {
    logger.error("Failed to resume simulation", { error: error.message });
    res.status(500).json({ error: "Failed to resume simulation" });
  }
});

router.post("/simulation/reset", async (req, res) => {
  try {
    await simulationLoop.reset();
    res.json({ message: "Simulation reset" });
  } catch (error) {
    logger.error("Failed to reset simulation", { error: error.message });
    res.status(500).json({ error: "Failed to reset simulation" });
  }
});

router.get("/simulation/stats", async (req, res) => {
  try {
    const stats = await simulationLoop.getStatistics();
    res.json(stats);
  } catch (error) {
    logger.error("Failed to get simulation statistics", {
      error: error.message,
    });
    res.status(500).json({ error: "Failed to get simulation statistics" });
  }
});

router.get("/llm/health", async (req, res) => {
  try {
    const health = await ollamaClient.healthCheck();
    res.json({ healthy: health });
  } catch (error) {
    logger.error("Failed to check LLM health", { error: error.message });
    res.status(500).json({ error: "Failed to check LLM health" });
  }
});

router.get("/llm/models", async (req, res) => {
  try {
    const models = await ollamaClient.listModels();
    res.json(models);
  } catch (error) {
    logger.error("Failed to get LLM models", { error: error.message });
    res.status(500).json({ error: "Failed to get LLM models" });
  }
});

router.get("/agents/:id/chat", async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const result = await query(
      "SELECT * FROM chat_messages WHERE agent_id = $1 ORDER BY timestamp DESC LIMIT $2",
      [req.params.id, parseInt(limit)]
    );
    res.json(result.rows.reverse());
  } catch (error) {
    logger.error("Failed to get chat messages", {
      agentId: req.params.id,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to get chat messages" });
  }
});

router.post("/agents/:id/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const agentResult = await query("SELECT * FROM agents WHERE id = $1", [
      req.params.id,
    ]);
    if (agentResult.rows.length === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const agent = agentResult.rows[0];

    await query(
      "INSERT INTO chat_messages (agent_id, agent_name, content, type, timestamp) VALUES ($1, $2, $3, $4, $5)",
      [req.params.id, "User", message, "user", new Date()]
    );

    const context = `User said: "${message}"`;
    const response = await ollamaClient.generateDialogue(
      agent,
      message,
      context
    );

    await query(
      "INSERT INTO chat_messages (agent_id, agent_name, content, type, timestamp) VALUES ($1, $2, $3, $4, $5)",
      [req.params.id, agent.name, response, "agent", new Date()]
    );

    res.json({
      message: response,
      agent: agent.name,
    });
  } catch (error) {
    logger.error("Failed to send chat message", {
      agentId: req.params.id,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to send chat message" });
  }
});

export default router;
