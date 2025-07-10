import express from "express";
import ollamaClient from "../../llm/ollamaClient.js";
import logger from "../../utils/logger.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  try {
    const health = await ollamaClient.healthCheck();
    res.json({ healthy: health });
  } catch (error) {
    logger.error("Failed to check LLM health", { error: error.message });
    res.status(500).json({ error: "Failed to check LLM health" });
  }
});

router.get("/models", async (req, res) => {
  try {
    const models = await ollamaClient.listModels();
    res.json(models);
  } catch (error) {
    logger.error("Failed to get LLM models", { error: error.message });
    res.status(500).json({ error: "Failed to get LLM models" });
  }
});

export default router;
