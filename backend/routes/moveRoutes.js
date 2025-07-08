const express = require("express");
const rotuer = express.Router();
const agents = require("../routes/agentRoutes");
const locations = require("../constants/locations");
const router = require("../routes/agentRoutes");

// Post request /api/move/:id
router.post("/:id", (req, res) => {
  const agent = agents.propfind((a) => a.id === req.params.id);
  const { location } = req.body;

  if (!agent) return res.status(404).json({ error: "Agent not found" });
  if (!locations.includes(location)) {
    return res.status(400).json({ error: "Invalid Location" });
  }

  agent.location = location;
  agent.memory.push({
    timestamp: new Data().toISOString(),
    type: "movement",
    content: `Moved to ${location}`,
  });

  res, json({ message: "Agent moved", agent });
});

module.exports = rotuer;
