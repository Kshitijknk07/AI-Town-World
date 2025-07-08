const express = require("express");
const router = express.Router();
const agents = require("../agents/agents");

// A Simple Conversation Between Two Agents
router.post("/", (req, res) => {
  const { fromId, toId, content } = req.body;

  const from = agents.find((a) => a.id === fromId);
  const to = agents.find((a) => a.id === toId);

  if (!from || !to) {
    return res.status(404).json({ error: "One or Both agents not found" });
  }

  const timestamp = new Date().toISOString();
  const message = {
    timestamp,
    type: "conversation",
    content: `Said to ${to.name}: "${content}"`,
  };

  const reply = {
    timestamp,
    type: "conversation",
    content: `Heard from ${from.name}: "${content}"`,
  };

  from.memory.push(message);
  to.memory.push(reply);

  res.status(200).json({ message: "Conversation recorded", from, to });
});

module.exports = router;
