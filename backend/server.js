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
      name: "Mystic Bookstore",
      description: "A cozy bookstore filled with ancient wisdom",
      type: "commercial",
      x: 0,
      y: 0,
      capacity: 3,
    },
    {
      id: "town-hall",
      name: "Grand Town Hall",
      description: "The heart of civic life and governance",
      type: "civic",
      x: 1,
      y: 0,
      capacity: 5,
    },
    {
      id: "school",
      name: "Harmony Elementary",
      description: "Where young minds flourish and grow",
      type: "civic",
      x: 2,
      y: 0,
      capacity: 8,
    },
    {
      id: "residential-1",
      name: "Oak Street",
      description: "Peaceful residential area with tree-lined streets",
      type: "residential",
      x: 0,
      y: 1,
      capacity: 2,
    },
    {
      id: "cafe",
      name: "Serenity Café",
      description: "Popular meeting spot with artisan coffee",
      type: "commercial",
      x: 1,
      y: 1,
      capacity: 4,
    },
    {
      id: "residential-2",
      name: "Maple Avenue",
      description: "Charming family neighborhood",
      type: "residential",
      x: 2,
      y: 1,
      capacity: 2,
    },
    {
      id: "park",
      name: "Tranquil Gardens",
      description: "Lush green space perfect for reflection",
      type: "park",
      x: 0,
      y: 2,
      capacity: 6,
    },
    {
      id: "library",
      name: "Wisdom Library",
      description: "Repository of knowledge and quiet study",
      type: "civic",
      x: 1,
      y: 2,
      capacity: 5,
    },
    {
      id: "market",
      name: "Artisan Market",
      description: "Vibrant marketplace with local crafts",
      type: "commercial",
      x: 2,
      y: 2,
      capacity: 8,
    },
  ];
  res.json(zones);
});

application.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

application.get("/", (req, res) => {
  res.json({ 
    message: "AI Town World Backend",
    version: "1.0.0",
    status: "running"
  });
});

const PORT = process.env.PORT || 3500;
application.listen(PORT, () =>
  console.log(`🚀 AI Town World Backend running on http://localhost:${PORT}`)
);