import express from "express";
import { query } from "../../data/db.js";
import ollamaClient from "../../llm/ollamaClient.js";
import logger from "../../utils/logger.js";

const router = express.Router();

router.get("/:id/chat", async (req, res) => {
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

router.post("/:id/chat", async (req, res) => {
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
    res.json({ message: response, agent: agent.name });
  } catch (error) {
    logger.error("Failed to send chat message", {
      agentId: req.params.id,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to send chat message" });
  }
});

export default router;
