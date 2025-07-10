import express from "express";
import agentsRouter from "./routes/agents.js";
import worldRouter from "./routes/world.js";
import simulationRouter from "./routes/simulation.js";
import llmRouter from "./routes/llm.js";
import eventsRouter from "./routes/events.js";
import chatRouter from "./routes/chat.js";

const router = express.Router();

router.use("/agents", agentsRouter);
router.use("/world", worldRouter);
router.use("/simulation", simulationRouter);
router.use("/llm", llmRouter);
router.use("/events", eventsRouter);
router.use("/agents", chatRouter);

export default router;
