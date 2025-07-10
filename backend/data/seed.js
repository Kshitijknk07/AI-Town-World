import { query } from "./db.js";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";

// Sample agents data
const sampleAgents = [
  {
    id: uuidv4(),
    name: "Alex",
    personality: {
      traits: ["curious", "friendly", "creative"],
      background: "A local artist who loves to paint and explore new ideas",
      interests: ["art", "nature", "conversation"],
      communication_style: "warm and engaging",
    },
    current_location: "cafe",
    current_goal: "Find inspiration for a new painting",
    current_thought:
      "The morning light through the cafe windows is beautiful...",
    energy: 85,
    mood: 0.3,
    schedule: {
      wakeTime: "07:00",
      sleepTime: "22:00",
      activities: [
        { time: "08:00", activity: "morning coffee at cafe" },
        { time: "10:00", activity: "painting session" },
        { time: "14:00", activity: "lunch and socializing" },
        { time: "16:00", activity: "evening walk" },
      ],
    },
    avatar: "🎨",
  },
  {
    id: uuidv4(),
    name: "Jamie",
    personality: {
      traits: ["organized", "helpful", "knowledgeable"],
      background: "A librarian who loves books and helping others learn",
      interests: ["reading", "research", "teaching"],
      communication_style: "clear and informative",
    },
    current_location: "library",
    current_goal: "Organize the new book collection",
    current_thought: "These new books need proper categorization...",
    energy: 90,
    mood: 0.1,
    schedule: {
      wakeTime: "06:30",
      sleepTime: "21:30",
      activities: [
        { time: "07:00", activity: "morning routine" },
        { time: "08:00", activity: "open library" },
        { time: "12:00", activity: "lunch break" },
        { time: "17:00", activity: "close library" },
      ],
    },
    avatar: "📚",
  },
  {
    id: uuidv4(),
    name: "Sam",
    personality: {
      traits: ["energetic", "social", "optimistic"],
      background:
        "A barista who loves making coffee and chatting with customers",
      interests: ["coffee", "people", "music"],
      communication_style: "enthusiastic and welcoming",
    },
    current_location: "cafe",
    current_goal: "Make the perfect cup of coffee",
    current_thought: "The aroma of fresh coffee beans is amazing today...",
    energy: 95,
    mood: 0.5,
    schedule: {
      wakeTime: "05:30",
      sleepTime: "23:00",
      activities: [
        { time: "06:00", activity: "prepare cafe" },
        { time: "07:00", activity: "serve customers" },
        { time: "15:00", activity: "afternoon break" },
        { time: "20:00", activity: "close cafe" },
      ],
    },
    avatar: "☕",
  },
  {
    id: uuidv4(),
    name: "Morgan",
    personality: {
      traits: ["thoughtful", "quiet", "observant"],
      background: "A writer who finds inspiration in everyday moments",
      interests: ["writing", "observation", "reflection"],
      communication_style: "thoughtful and measured",
    },
    current_location: "park",
    current_goal: "Write a new chapter",
    current_thought:
      "The way the leaves rustle in the wind could be a metaphor...",
    energy: 70,
    mood: 0.2,
    schedule: {
      wakeTime: "08:00",
      sleepTime: "23:30",
      activities: [
        { time: "09:00", activity: "morning walk" },
        { time: "10:00", activity: "writing session" },
        { time: "14:00", activity: "lunch and reading" },
        { time: "16:00", activity: "evening reflection" },
      ],
    },
    avatar: "✍️",
  },
  {
    id: uuidv4(),
    name: "Casey",
    personality: {
      traits: ["adventurous", "independent", "resourceful"],
      background: "A traveler who recently settled in town",
      interests: ["exploration", "stories", "new experiences"],
      communication_style: "engaging and storytelling",
    },
    current_location: "home",
    current_goal: "Explore the town and meet new people",
    current_thought:
      "This town has so much character, I should explore more...",
    energy: 100,
    mood: 0.4,
    schedule: {
      wakeTime: "07:30",
      sleepTime: "22:30",
      activities: [
        { time: "08:00", activity: "morning exploration" },
        { time: "12:00", activity: "lunch at different places" },
        { time: "15:00", activity: "afternoon adventures" },
        { time: "19:00", activity: "evening socializing" },
      ],
    },
    avatar: "🧭",
  },
];

// Sample buildings data
const sampleBuildings = [
  {
    id: "cafe",
    name: "Cozy Corner Cafe",
    type: "restaurant",
    position_x: 300,
    position_y: 200,
    capacity: 20,
    description: "A warm and inviting cafe with the best coffee in town",
    icon: "☕",
    current_occupants: [],
  },
  {
    id: "library",
    name: "Town Library",
    type: "public",
    position_x: 500,
    position_y: 150,
    capacity: 15,
    description: "A quiet space filled with books and knowledge",
    icon: "📚",
    current_occupants: [],
  },
  {
    id: "park",
    name: "Central Park",
    type: "outdoor",
    position_x: 200,
    position_y: 400,
    capacity: 50,
    description:
      "A beautiful green space perfect for relaxation and inspiration",
    icon: "🌳",
    current_occupants: [],
  },
  {
    id: "home",
    name: "Residential Area",
    type: "residential",
    position_x: 100,
    position_y: 100,
    capacity: 10,
    description: "A peaceful neighborhood where residents live",
    icon: "🏠",
    current_occupants: [],
  },
];

// Sample events data
const sampleEvents = [
  {
    agent_id: sampleAgents[0].id,
    agent_name: "Alex",
    type: "arrival",
    description: "Alex arrived at the cafe looking for inspiration",
    location: "cafe",
    importance: "medium",
  },
  {
    agent_id: sampleAgents[1].id,
    agent_name: "Jamie",
    type: "work",
    description: "Jamie started organizing the library shelves",
    location: "library",
    importance: "low",
  },
  {
    agent_id: sampleAgents[2].id,
    agent_name: "Sam",
    type: "work",
    description: "Sam prepared the cafe for the morning rush",
    location: "cafe",
    importance: "medium",
  },
];

// Seed function
async function seedDatabase() {
  try {
    logger.info("Starting database seeding...");

    // Clear existing data
    await query("DELETE FROM events");
    await query("DELETE FROM memories");
    await query("DELETE FROM chat_messages");
    await query("DELETE FROM agents");
    await query("DELETE FROM buildings");

    logger.info("Cleared existing data");

    // Insert sample agents
    for (const agent of sampleAgents) {
      await query(
        `INSERT INTO agents (id, name, personality, current_location, current_goal, current_thought, 
          energy, mood, schedule, avatar, relationships, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          agent.id,
          agent.name,
          JSON.stringify(agent.personality),
          agent.current_location,
          agent.current_goal,
          agent.current_thought,
          agent.energy,
          agent.mood,
          JSON.stringify(agent.schedule),
          agent.avatar,
          JSON.stringify({}),
          new Date(),
          new Date(),
        ]
      );
    }
    logger.info(`Inserted ${sampleAgents.length} agents`);

    // Insert sample buildings
    for (const building of sampleBuildings) {
      await query(
        `INSERT INTO buildings (id, name, type, position_x, position_y, capacity, description, icon, current_occupants, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          building.id,
          building.name,
          building.type,
          building.position_x,
          building.position_y,
          building.capacity,
          building.description,
          building.icon,
          JSON.stringify(building.current_occupants),
          new Date(),
        ]
      );
    }
    logger.info(`Inserted ${sampleBuildings.length} buildings`);

    // Insert sample events
    for (const event of sampleEvents) {
      await query(
        `INSERT INTO events (agent_id, agent_name, type, description, location, importance, timestamp) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          event.agent_id,
          event.agent_name,
          event.type,
          event.description,
          event.location,
          event.importance,
          new Date(),
        ]
      );
    }
    logger.info(`Inserted ${sampleEvents.length} events`);

    // Insert sample memories for each agent
    for (const agent of sampleAgents) {
      const memories = [
        {
          content: `I arrived in this town and it feels like a fresh start.`,
          type: "arrival",
          emotionalImpact: 0.3,
        },
        {
          content: `The ${agent.current_location} is becoming my favorite place.`,
          type: "location",
          emotionalImpact: 0.2,
        },
        {
          content: `I should focus on my goal: ${agent.current_goal}`,
          type: "goal",
          emotionalImpact: 0.1,
        },
      ];

      for (const memory of memories) {
        await query(
          `INSERT INTO memories (agent_id, content, type, emotional_impact, timestamp) 
           VALUES ($1, $2, $3, $4, $5)`,
          [
            agent.id,
            memory.content,
            memory.type,
            memory.emotionalImpact,
            new Date(),
          ]
        );
      }
    }
    logger.info(`Inserted sample memories for ${sampleAgents.length} agents`);

    // Insert sample chat messages
    const chatMessages = [
      {
        agent_id: sampleAgents[0].id,
        agent_name: "Alex",
        content: "Hello! I'm looking for some inspiration for my art.",
        type: "agent",
      },
      {
        agent_id: sampleAgents[2].id,
        agent_name: "Sam",
        content: "Welcome! I'm sure you'll find plenty of inspiration here.",
        type: "agent",
      },
    ];

    for (const message of chatMessages) {
      await query(
        `INSERT INTO chat_messages (agent_id, agent_name, content, type, timestamp) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          message.agent_id,
          message.agent_name,
          message.content,
          message.type,
          new Date(),
        ]
      );
    }
    logger.info(`Inserted ${chatMessages.length} chat messages`);

    logger.info("Database seeding completed successfully!");

    // Log summary
    const agentCount = await query("SELECT COUNT(*) as count FROM agents");
    const buildingCount = await query(
      "SELECT COUNT(*) as count FROM buildings"
    );
    const eventCount = await query("SELECT COUNT(*) as count FROM events");
    const memoryCount = await query("SELECT COUNT(*) as count FROM memories");

    logger.info("Database summary:", {
      agents: agentCount.rows[0].count,
      buildings: buildingCount.rows[0].count,
      events: eventCount.rows[0].count,
      memories: memoryCount.rows[0].count,
    });
  } catch (error) {
    logger.error("Failed to seed database", { error: error.message });
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      logger.info("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Seeding failed", { error: error.message });
      process.exit(1);
    });
}

export { seedDatabase, sampleAgents, sampleBuildings };
