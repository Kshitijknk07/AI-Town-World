import pg from "pg";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const { Pool } = pg;

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  ssl: config.database.ssl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  logger.info("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  logger.error("Unexpected error on idle client", err);
  process.exit(-1);
});

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

export const getClient = () => {
  return pool.connect();
};

export const closePool = async () => {
  await pool.end();
  logger.info("Database pool closed");
};

export const initializeDatabase = async () => {
  try {
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

    await query(`
      CREATE TABLE IF NOT EXISTS world_state (
        id INTEGER PRIMARY KEY DEFAULT 1,
        current_sim_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        day INTEGER DEFAULT 1,
        hour INTEGER DEFAULT 0,
        minute INTEGER DEFAULT 0,
        speed VARCHAR(20) DEFAULT 'normal',
        is_running BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      INSERT INTO world_state (id, current_sim_time, day, hour, minute, speed, is_running)
      VALUES (1, CURRENT_TIMESTAMP, 1, 10, 30, 'normal', true)
      ON CONFLICT (id) DO NOTHING
    `);

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
