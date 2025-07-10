import express from "express";
import { query } from "../../data/db.js";
import logger from "../../utils/logger.js";

const router = express.Router();

router.get("/", async (req, res) => {
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

export default router;
