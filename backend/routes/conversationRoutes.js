const express = require("express");
const router = express.Router();
const agents = require("../agents/agents");

router.post("/", (req, res) => {
  const { fromId, toId, content } = req.body;

  const from = agents.find((a) => a.id === fromId);
  const to = agents.find((a) => a.id === toId);

  if (!from || !to) {
    return res.status(404).json({ error: "One or Both agents not found" });
  }

  from.status = "talking";
  to.status = "talking";

  const timestamp = new Date().toISOString();
  const message = {
    timestamp,
    type: "conversation",
    content: `Said to ${to.name}: "${content}"`,
    location: from.location,
  };

  const reply = {
    timestamp,
    type: "conversation",
    content: `Heard from ${from.name}: "${content}"`,
    location: to.location,
  };

  from.memory.push(message);
  to.memory.push(reply);

  setTimeout(() => {
    from.status = "idle";
    to.status = "idle";
  }, 2000);

  res.status(200).json({ message: "Conversation recorded", from, to });
});

module.exports = router;
