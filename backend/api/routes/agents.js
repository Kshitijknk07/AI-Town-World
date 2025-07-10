import express from "express";
import { v4 as uuidv4 } from "uuid";
import { query } from "../../data/db.js";
import agentThinker from "../../agents/thinker.js";
import simulationLoop from "../../simulationLoop.js";
import embeddingClient from "../../vector/embeddingClient.js";
import logger from "../../utils/logger.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM agents ORDER BY created_at");
    res.json(result.rows);
  } catch (error) {
    logger.error("Failed to get agents", { error: error.message });
    res.status(500).json({ error: "Failed to get agents" });
  }
});

router.get("/:id", async (req, res) => {
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

router.post("/", async (req, res) => {
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
      `INSERT INTO agents (id, name, personality, current_location, current_goal, current_thought, energy, mood, schedule, avatar, relationships, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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

router.post("/:id/thought", async (req, res) => {
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

router.get("/:id/memories", async (req, res) => {
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

export default router;
