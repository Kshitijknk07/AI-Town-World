const express = require("express");
const router = express.Router();
const agents = require("../agents/agents");
const locations = require("../constants/locations");

// Post request /api/move/:id
router.post("/:id", (req, res) => {
  const agent = agents.find((a) => a.id === req.params.id);
  const { location } = req.body;

  if (!agent) return res.status(404).json({ error: "Agent not found" });
  if (!locations.includes(location)) {
    return res.status(400).json({ error: "Invalid Location" });
  }

  // Update agent location and status
  agent.location = location;
  agent.status = "moving";

  // Add movement memory
  agent.memory.push({
    timestamp: new Date().toISOString(),
    type: "movement",
    content: `Moved to ${location}`,
    location: location,
  });

  // Reset status to idle after a short delay (simulate movement)
  setTimeout(() => {
    agent.status = "idle";
  }, 1000);

  res.json({ message: "Agent moved", agent });
});

module.exports = router;
