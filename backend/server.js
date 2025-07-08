const express = require("express");
const cors = require("cors");

const application = express();

application.use(cors());
application.use(express.json());

const moveRoutes = require("./routes/moveRoutes");
application.use("/api/move", moveRoutes);

const conversationRoutes = require("./routes/conversationRoutes");
application.use("/api/conversation", conversationRoutes);

const agentRoutes = require("./routes/agentRoutes");
application.use("/api/agents", agentRoutes);

const memoryRoutes = require("./routes/memoryRoutes");
application.use("/api/memory", memoryRoutes);

application.get("/api/zones", (req, res) => {
  const zones = [
    {
      id: "bookstore",
      name: "Bookstore",
      description: "A cozy bookstore",
      type: "commercial",
      x: 1,
      y: 1,
      capacity: 3,
    },
    {
      id: "town-hall",
      name: "Town Hall",
      description: "Administrative center",
      type: "civic",
      x: 2,
      y: 1,
      capacity: 5,
    },
    {
      id: "park",
      name: "Central Park",
      description: "Green space for relaxation",
      type: "park",
      x: 0,
      y: 2,
      capacity: 6,
    },
    {
      id: "cafe",
      name: "Town Café",
      description: "Popular meeting spot",
      type: "commercial",
      x: 1,
      y: 2,
      capacity: 4,
    },
    {
      id: "library",
      name: "Library",
      description: "Quiet study space",
      type: "civic",
      x: 2,
      y: 2,
      capacity: 8,
    },
    {
      id: "market",
      name: "Market Square",
      description: "Bustling marketplace",
      type: "commercial",
      x: 0,
      y: 0,
      capacity: 10,
    },
    {
      id: "residential-1",
      name: "Oak Street",
      description: "Quiet residential area",
      type: "residential",
      x: 0,
      y: 1,
      capacity: 2,
    },
    {
      id: "residential-2",
      name: "Maple Avenue",
      description: "Family neighborhood",
      type: "residential",
      x: 2,
      y: 0,
      capacity: 2,
    },
    {
      id: "school",
      name: "Elementary School",
      description: "Local school",
      type: "civic",
      x: 1,
      y: 0,
      capacity: 15,
    },
  ];
  res.json(zones);
});

application.get("/", (req, res) => {
  res.send("AI Town backend is Running");
});

application.listen(3500, () =>
  console.log("Your Backend is running on http://localhost:3500")
);
