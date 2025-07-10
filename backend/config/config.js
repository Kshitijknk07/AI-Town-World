import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || "localhost",
    environment: process.env.NODE_ENV || "development",
  },

  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || "ai_town_world",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  },

  llm: {
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "mistral:instruct",
    temperature: parseFloat(process.env.LLM_TEMPERATURE) || 0.7,
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS) || 500,
    timeout: parseInt(process.env.LLM_TIMEOUT) || 30000,
  },

  simulation: {
    tickInterval: parseInt(process.env.TICK_INTERVAL) || 1000, // 1 second
    agentThinkInterval: parseInt(process.env.AGENT_THINK_INTERVAL) || 2000, // 2 seconds
    timeScale: parseInt(process.env.TIME_SCALE) || 1,
    maxAgents: parseInt(process.env.MAX_AGENTS) || 10,
    memoryRetentionDays: parseInt(process.env.MEMORY_RETENTION_DAYS) || 30,
  },

  vector: {
    dimension: parseInt(process.env.VECTOR_DIMENSION) || 384,
    similarityThreshold: parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.7,
    maxResults: parseInt(process.env.MAX_VECTOR_RESULTS) || 10,
  },

  security: {
    jwtSecret:
      process.env.JWT_SECRET || "ai-town-secret-key-change-in-production",
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "logs/app.log",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
};

export default config;
