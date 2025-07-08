const express = require("express");
const router = express.Router();
const agents = require("../agents/agents");

router.get("/", (req, res) => {
  res.json(agents);
});

module.exports = router;
