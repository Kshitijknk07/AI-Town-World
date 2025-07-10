import express from "express";
import simulationLoop from "../../simulationLoop.js";
import logger from "../../utils/logger.js";

const router = express.Router();

router.get("/status", async (req, res) => {
  try {
    const status = simulationLoop.getStatus();
    res.json(status);
  } catch (error) {
    logger.error("Failed to get simulation status", { error: error.message });
    res.status(500).json({ error: "Failed to get simulation status" });
  }
});

router.post("/start", async (req, res) => {
  try {
    simulationLoop.start();
    res.json({ message: "Simulation started" });
  } catch (error) {
    logger.error("Failed to start simulation", { error: error.message });
    res.status(500).json({ error: "Failed to start simulation" });
  }
});

router.post("/stop", async (req, res) => {
  try {
    simulationLoop.stop();
    res.json({ message: "Simulation stopped" });
  } catch (error) {
    logger.error("Failed to stop simulation", { error: error.message });
    res.status(500).json({ error: "Failed to stop simulation" });
  }
});

router.post("/pause", async (req, res) => {
  try {
    await simulationLoop.pause();
    res.json({ message: "Simulation paused" });
  } catch (error) {
    logger.error("Failed to pause simulation", { error: error.message });
    res.status(500).json({ error: "Failed to pause simulation" });
  }
});

router.post("/resume", async (req, res) => {
  try {
    await simulationLoop.resume();
    res.json({ message: "Simulation resumed" });
  } catch (error) {
    logger.error("Failed to resume simulation", { error: error.message });
    res.status(500).json({ error: "Failed to resume simulation" });
  }
});

router.post("/reset", async (req, res) => {
  try {
    await simulationLoop.reset();
    res.json({ message: "Simulation reset" });
  } catch (error) {
    logger.error("Failed to reset simulation", { error: error.message });
    res.status(500).json({ error: "Failed to reset simulation" });
  }
});

router.get("/stats", async (req, res) => {
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

export default router;
