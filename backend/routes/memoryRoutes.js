const express = require("express");
const router = express.Router();
const agents = require("../agents/agents");

// We are Getting the Agent Memory
router.get("/:id", (req, res) => {
  const agent = agents.find((a) => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: "Agent not found" });
  res.json(agent.memory);
});

// We are POST a new memory to agent
router.post("/:id", (req, res) => {
  const agent = agents.find((a) => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: "Agent not found" });

  const memory = {
    timestamp: new Date().toISOString,
    type: req.body.type || "event",
    content: req.body.content || "No Content",
  };

  agent.memory.push(memory);
  res.status(201).json({ message: "Memory added", memory });
});

module.exports = router;
