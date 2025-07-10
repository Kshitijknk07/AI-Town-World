import pg from "pg";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const { Pool } = pg;

// Create connection pool
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  ssl: config.database.ssl,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test database connection
pool.on("connect", () => {
  logger.info("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  logger.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Database query helper
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error("Database query error", { text, error: error.message });
    throw error;
  }
};

// Get a client from the pool
export const getClient = () => {
  return pool.connect();
};

// Close the pool
export const closePool = async () => {
  await pool.end();
  logger.info("Database pool closed");
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Create agents table
    await query(`
      CREATE TABLE IF NOT EXISTS agents (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        personality JSONB NOT NULL,
        current_location VARCHAR(100) NOT NULL,
        current_goal TEXT,
        current_thought TEXT,
        energy INTEGER DEFAULT 100,
        mood FLOAT DEFAULT 0.0,
        schedule JSONB,
        avatar VARCHAR(10),
        relationships JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    await query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        agent_id VARCHAR(50),
        agent_name VARCHAR(100),
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(100),
        importance VARCHAR(20) DEFAULT 'low',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
      )
    `);

    // Create buildings table
    await query(`
      CREATE TABLE IF NOT EXISTS buildings (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        position_x INTEGER NOT NULL,
        position_y INTEGER NOT NULL,
        capacity INTEGER DEFAULT 10,
        description TEXT,
        icon VARCHAR(10),
        current_occupants JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create memories table
    await query(`
      CREATE TABLE IF NOT EXISTS memories (
        id SERIAL PRIMARY KEY,
        agent_id VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        related_agent VARCHAR(50),
        location VARCHAR(100),
        emotional_impact FLOAT DEFAULT 0.0,
        embedding VECTOR(384),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
      )
    `);

    // Create chat_messages table
    await query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        agent_id VARCHAR(50) NOT NULL,
        agent_name VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
      )
    `);

    // Create world_state table
    await query(`
      CREATE TABLE IF NOT EXISTS world_state (
        id INTEGER PRIMARY KEY DEFAULT 1,
        current_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        day INTEGER DEFAULT 1,
        hour INTEGER DEFAULT 0,
        minute INTEGER DEFAULT 0,
        speed VARCHAR(20) DEFAULT 'normal',
        is_running BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default world state if not exists
    await query(`
      INSERT INTO world_state (id, current_time, day, hour, minute, speed, is_running)
      VALUES (1, CURRENT_TIMESTAMP, 1, 10, 30, 'normal', true)
      ON CONFLICT (id) DO NOTHING
    `);

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_events_agent_id ON events(agent_id);
      CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
      CREATE INDEX IF NOT EXISTS idx_memories_agent_id ON memories(agent_id);
      CREATE INDEX IF NOT EXISTS idx_memories_timestamp ON memories(timestamp);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_agent_id ON chat_messages(agent_id);
    `);

    logger.info("Database tables initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize database tables", error);
    throw error;
  }
};

export default pool;
