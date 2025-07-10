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

  // Initialize the server
  async initialize() {
    try {
      logger.info("Initializing AI Town Server...");

      // Initialize database
      await initializeDatabase();
      logger.info("Database initialized");

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Setup error handling
      this.setupErrorHandling();

      // Create HTTP server
      this.server = http.createServer(this.app);

      // Initialize WebSocket handler
      socketHandler.initialize(this.server);

      // Initialize simulation loop
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

  // Setup Express middleware
  setupMiddleware() {
    // Security middleware
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

    // CORS middleware
    this.app.use(cors(config.cors));

    // Request logging
    this.app.use(morgan("combined"));
    this.app.use(requestLogger);

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Static files (if needed)
    this.app.use("/static", express.static("public"));

    logger.info("Middleware setup completed");
  }

  // Setup API routes
  setupRoutes() {
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: "1.0.0",
      });
    });

    // API routes
    this.app.use("/api", routes);

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        error: "Endpoint not found",
        path: req.originalUrl,
        method: req.method,
      });
    });

    logger.info("Routes setup completed");
  }

  // Setup error handling
  setupErrorHandling() {
    // Global error handler
    this.app.use(errorLogger);

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", { promise, reason });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", {
        error: error.message,
        stack: error.stack,
      });
      this.shutdown();
    });

    // Handle graceful shutdown
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

  // Start the server
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

        // Start simulation loop
        simulationLoop.start();
        logger.info("Simulation loop started");
      });
    } catch (error) {
      logger.error("Failed to start server", { error: error.message });
      throw error;
    }
  }

  // Stop the server
  async stop() {
    try {
      logger.info("Stopping AI Town Server...");

      // Stop simulation loop
      simulationLoop.stop();
      logger.info("Simulation loop stopped");

      // Close server
      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
        logger.info("HTTP server closed");
      }

      // Cleanup WebSocket handler
      socketHandler.cleanup();

      // Cleanup simulation loop
      simulationLoop.cleanup();

      logger.info("AI Town Server stopped successfully");
    } catch (error) {
      logger.error("Error stopping server", { error: error.message });
    }
  }

  // Graceful shutdown
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

  // Get server status
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

// Create and start server
const server = new AITownServer();

// Initialize and start server
async function startServer() {
  try {
    await server.initialize();
    await server.start();
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default server;
