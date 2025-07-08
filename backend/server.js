// Main backend

const express = require("express");
const cors = require("cors");

const application = express();

application.use(cors());
application.use(express.json());

const moveRoutes = require("./routes/moveRoutes");
application.use("api/move", moveRoutes);

const conversationRoutes = require("./routes/conversationRoutes");
application.use("/api/conversation", conversationRoutes);

const agentRoutes = require("./routes/agentRoutes");
application.use("/api/agents", agentRoutes);

const memoryRoutes = require("./routes/memoryRoutes");
application.use("/api/memory", memoryRoutes);

application.get("/", (req, res) => {
  res.send("AI Town backend is Running");
});

application.listen(3500, () =>
  console.log("Your Backend is running on http://localhost:3500")
);
