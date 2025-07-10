import express from "express";
import { query } from "../../data/db.js";
import worldTime from "../../world/time.js";
import logger from "../../utils/logger.js";
import socketHandler from "../../sockets/socketHandler.js";

const router = express.Router();

router.get("/time", async (req, res) => {
  try {
    const timeState = worldTime.getCurrentTime();
    res.json(timeState);
  } catch (error) {
    logger.error("Failed to get world time", { error: error.message });
    res.status(500).json({ error: "Failed to get world time" });
  }
});

router.post("/speed", async (req, res) => {
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

router.post("/reset", async (req, res) => {
  try {
    await worldTime.reset();
    res.json({ message: "World time reset" });
  } catch (error) {
    logger.error("Failed to reset world time", { error: error.message });
    res.status(500).json({ error: "Failed to reset world time" });
  }
});

router.post("/set-time", async (req, res) => {
  const { hour, minute } = req.body;
  try {
    await query(
      `UPDATE world_state SET hour = $1, minute = $2, updated_at = $3 WHERE id = 1`,
      [hour, minute, new Date()]
    );
    worldTime.hour = hour;
    worldTime.minute = minute;
    worldTime.currentTime.setHours(hour);
    worldTime.currentTime.setMinutes(minute);
    socketHandler.broadcastWorldTime();
    res.json({ success: true, hour, minute });
  } catch (error) {
    logger.error("Failed to set world time", { error: error.message });
    res.status(500).json({ error: "Failed to set world time" });
  }
});

router.get("/buildings", async (req, res) => {
  try {
    const result = await query("SELECT * FROM buildings ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    logger.error("Failed to get buildings", { error: error.message });
    res.status(500).json({ error: "Failed to get buildings" });
  }
});

export default router;
