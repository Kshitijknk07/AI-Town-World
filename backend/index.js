import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import config from "./config/config.js";
import { initializeDatabase } from "./data/db.js";
import routes from "./api/routes.js";
import socketHandler from "./sockets/socketHandler.js";
import simulationLoop from "./simulationLoop.js";
import { requestLogger, errorLogger } from "./utils/logger.js";
import logger from "./utils/logger.js";

class AITownServer {
  constructor() {
    this.app = express();
    this.server = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      logger.info("Initializing AI Town Server...");

      await initializeDatabase();
      logger.info("Database initialized");

      this.setupMiddleware();

      this.setupRoutes();

      this.setupErrorHandling();

      this.server = http.createServer(this.app);

      socketHandler.initialize(this.server);

      await simulationLoop.initialize();
      logger.info("Simulation loop initialized");

      this.isInitialized = true;
      logger.info("AI Town Server initialization completed");
    } catch (error) {
      logger.error("Failed to initialize AI Town Server", {
        error: error.message,
      });
      throw error;
    }
  }

  setupMiddleware() {
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        },
      })
    );

    this.app.use(cors(config.cors));

    this.app.use(morgan("combined"));
    this.app.use(requestLogger);

    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    this.app.use("/static", express.static("public"));

    logger.info("Middleware setup completed");
  }

  setupRoutes() {
    this.app.get("/health", (req, res) => {
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: "1.0.0",
      });
    });

    this.app.use("/api", routes);

    this.app.use("*", (req, res) => {
      res.status(404).json({
        error: "Endpoint not found",
        path: req.originalUrl,
        method: req.method,
      });
    });

    logger.info("Routes setup completed");
  }

  setupErrorHandling() {
    this.app.use(errorLogger);

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", { promise, reason });
    });

    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", {
        error: error.message,
        stack: error.stack,
      });
      this.shutdown();
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully");
      this.shutdown();
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received, shutting down gracefully");
      this.shutdown();
    });

    logger.info("Error handling setup completed");
  }

  async start() {
    if (!this.isInitialized) {
      throw new Error("Server not initialized. Call initialize() first.");
    }

    try {
      const port = config.server.port;
      const host = config.server.host;

      this.server.listen(port, host, () => {
        logger.info("AI Town Server started", {
          host,
          port,
          environment: config.server.environment,
          nodeVersion: process.version,
        });

        simulationLoop.start();
        logger.info("Simulation loop started");
      });
    } catch (error) {
      logger.error("Failed to start server", { error: error.message });
      throw error;
    }
  }

  async stop() {
    try {
      logger.info("Stopping AI Town Server...");

      simulationLoop.stop();
      logger.info("Simulation loop stopped");

      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
        logger.info("HTTP server closed");
      }

      socketHandler.cleanup();

      simulationLoop.cleanup();

      logger.info("AI Town Server stopped successfully");
    } catch (error) {
      logger.error("Error stopping server", { error: error.message });
    }
  }

  async shutdown() {
    try {
      logger.info("Shutting down AI Town Server...");
      await this.stop();
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown", { error: error.message });
      process.exit(1);
    }
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isRunning: !!this.server,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      simulation: simulationLoop.getStatus(),
      connectedClients: socketHandler.getConnectedClientsCount(),
    };
  }
}

const server = new AITownServer();

async function startServer() {
  try {
    await server.initialize();
    await server.start();
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default server;
