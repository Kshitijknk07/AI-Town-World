import { v4 as uuidv4 } from "uuid";
import ollamaClient from "../llm/ollamaClient.js";
import embeddingClient from "../vector/embeddingClient.js";
import { query } from "../data/db.js";
import logger from "../utils/logger.js";

class AgentThinker {
  constructor() {
    this.thinkingAgents = new Set(); // Prevent concurrent thinking for same agent
  }

  // Main agent thinking loop
  async think(agentId) {
    if (this.thinkingAgents.has(agentId)) {
      logger.debug("Agent already thinking", { agentId });
      return;
    }

    this.thinkingAgents.add(agentId);

    try {
      // Get agent data
      const agent = await this.getAgent(agentId);
      if (!agent) {
        throw new Error(`Agent not found: ${agentId}`);
      }

      // Get context (recent events, other agents nearby, etc.)
      const context = await this.buildContext(agent);

      // Generate new thought
      const newThought = await this.generateThought(agent, context);

      // Decide on action
      const action = await this.decideAction(agent, context);

      // Execute action
      await this.executeAction(agent, action);

      // Update agent state
      await this.updateAgentState(agentId, {
        current_thought: newThought,
        updated_at: new Date(),
      });

      // Store memory of this thinking cycle
      await this.storeMemory(agentId, {
        content: `Thought: ${newThought}. Action: ${action.description}`,
        type: "thought",
        emotionalImpact: action.emotionalImpact || 0,
      });

      // Log event
      await this.logEvent(
        agentId,
        agent.name,
        action.type,
        action.description,
        agent.current_location
      );

      logger.info("Agent thinking completed", {
        agentId,
        agentName: agent.name,
        thought: newThought.substring(0, 100),
        action: action.type,
      });
    } catch (error) {
      logger.error("Agent thinking failed", { agentId, error: error.message });
    } finally {
      this.thinkingAgents.delete(agentId);
    }
  }

  // Get agent from database
  async getAgent(agentId) {
    const result = await query("SELECT * FROM agents WHERE id = $1", [agentId]);
    return result.rows[0];
  }

  // Build context for agent thinking
  async buildContext(agent) {
    const context = {
      currentTime: await this.getCurrentTime(),
      location: agent.current_location,
      nearbyAgents: await this.getNearbyAgents(agent.current_location),
      recentEvents: await this.getRecentEvents(agent.current_location, 5),
      recentMemories: await this.getRecentMemories(agent.id, 3),
      relationships: agent.relationships || {},
    };

    return context;
  }

  // Generate agent thought using LLM
  async generateThought(agent, context) {
    const contextString = this.formatContext(context);

    try {
      const thought = await ollamaClient.generateThought(agent, contextString);
      return thought;
    } catch (error) {
      logger.error("Failed to generate thought", {
        agentId: agent.id,
        error: error.message,
      });
      return this.generateFallbackThought(agent, context);
    }
  }

  // Fallback thought generation
  generateFallbackThought(agent, context) {
    const thoughts = [
      `I'm at ${context.location} and feeling ${this.getMoodDescription(
        agent.mood
      )}.`,
      `I should focus on my goal: ${agent.current_goal}.`,
      `I wonder what ${context.nearbyAgents[0]?.name || "everyone"} is up to.`,
      `The time is ${context.currentTime.hour}:${context.currentTime.minute}, I should plan my day.`,
      `I remember ${
        context.recentMemories[0]?.content || "recent events"
      } and it makes me think.`,
    ];

    return thoughts[Math.floor(Math.random() * thoughts.length)];
  }

  // Decide on action
  async decideAction(agent, context) {
    const availableActions = this.getAvailableActions(agent, context);

    if (availableActions.length === 0) {
      return {
        type: "idle",
        description: "Staying put and observing",
        emotionalImpact: 0,
      };
    }

    try {
      const actionName = await ollamaClient.generateAction(
        agent,
        this.formatContext(context),
        availableActions
      );
      return this.parseAction(actionName, agent, context);
    } catch (error) {
      logger.error("Failed to generate action", {
        agentId: agent.id,
        error: error.message,
      });
      return this.generateFallbackAction(agent, context, availableActions);
    }
  }

  // Get available actions based on context
  getAvailableActions(agent, context) {
    const actions = ["idle", "observe", "think"];

    // Add movement actions if there are other locations
    if (context.location !== "home") {
      actions.push("move_home");
    }

    // Add social actions if there are nearby agents
    if (context.nearbyAgents.length > 0) {
      actions.push("greet", "converse", "observe_others");
    }

    // Add goal-specific actions
    if (agent.current_goal.includes("work")) {
      actions.push("work");
    }
    if (agent.current_goal.includes("rest")) {
      actions.push("rest");
    }

    return actions;
  }

  // Parse action from LLM response
  parseAction(actionName, agent, context) {
    const actionNameLower = actionName.toLowerCase();

    if (actionNameLower.includes("move") || actionNameLower.includes("go")) {
      return {
        type: "move",
        description: `Moving to a new location`,
        targetLocation: this.getRandomLocation(context.location),
        emotionalImpact: 0.1,
      };
    }

    if (
      actionNameLower.includes("greet") ||
      actionNameLower.includes("hello")
    ) {
      const targetAgent = context.nearbyAgents[0];
      return {
        type: "social",
        description: `Greeting ${targetAgent?.name || "someone"}`,
        targetAgent: targetAgent?.id,
        emotionalImpact: 0.3,
      };
    }

    if (
      actionNameLower.includes("converse") ||
      actionNameLower.includes("talk")
    ) {
      const targetAgent = context.nearbyAgents[0];
      return {
        type: "social",
        description: `Having a conversation with ${
          targetAgent?.name || "someone"
        }`,
        targetAgent: targetAgent?.id,
        emotionalImpact: 0.5,
      };
    }

    if (actionNameLower.includes("work")) {
      return {
        type: "work",
        description: "Working on current tasks",
        emotionalImpact: 0.2,
      };
    }

    if (actionNameLower.includes("rest")) {
      return {
        type: "rest",
        description: "Taking a moment to rest",
        emotionalImpact: 0.1,
      };
    }

    return {
      type: "idle",
      description: "Staying put and observing",
      emotionalImpact: 0,
    };
  }

  // Generate fallback action
  generateFallbackAction(agent, context, availableActions) {
    const action =
      availableActions[Math.floor(Math.random() * availableActions.length)];
    return this.parseAction(action, agent, context);
  }

  // Execute the decided action
  async executeAction(agent, action) {
    switch (action.type) {
      case "move":
        await this.moveAgent(agent.id, action.targetLocation);
        break;
      case "social":
        await this.performSocialAction(agent, action);
        break;
      case "work":
        await this.performWorkAction(agent);
        break;
      case "rest":
        await this.performRestAction(agent);
        break;
      default:
        // idle action - do nothing
        break;
    }
  }

  // Move agent to new location
  async moveAgent(agentId, targetLocation) {
    await query(
      "UPDATE agents SET current_location = $1, updated_at = $2 WHERE id = $3",
      [targetLocation, new Date(), agentId]
    );

    logger.info("Agent moved", { agentId, targetLocation });
  }

  // Perform social action
  async performSocialAction(agent, action) {
    if (action.targetAgent) {
      // Update relationship
      const currentRelationships = agent.relationships || {};
      const currentRelationship = currentRelationships[action.targetAgent] || 0;
      const newRelationship = Math.min(1, currentRelationship + 0.1);

      await query(
        "UPDATE agents SET relationships = jsonb_set(relationships, $1, $2), updated_at = $3 WHERE id = $4",
        [
          `{${action.targetAgent}}`,
          JSON.stringify(newRelationship),
          new Date(),
          agent.id,
        ]
      );
    }
  }

  // Perform work action
  async performWorkAction(agent) {
    // Decrease energy
    const newEnergy = Math.max(0, agent.energy - 5);
    await query(
      "UPDATE agents SET energy = $1, updated_at = $2 WHERE id = $3",
      [newEnergy, new Date(), agent.id]
    );
  }

  // Perform rest action
  async performRestAction(agent) {
    // Increase energy
    const newEnergy = Math.min(100, agent.energy + 10);
    await query(
      "UPDATE agents SET energy = $1, updated_at = $2 WHERE id = $3",
      [newEnergy, new Date(), agent.id]
    );
  }

  // Update agent state
  async updateAgentState(agentId, updates) {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = [agentId, ...Object.values(updates)];

    await query(`UPDATE agents SET ${setClause} WHERE id = $1`, values);
  }

  // Store memory
  async storeMemory(agentId, memory) {
    const memoryId = uuidv4();
    const memoryData = {
      id: memoryId,
      content: memory.content,
      type: memory.type,
      relatedAgent: memory.relatedAgent,
      location: memory.location,
      emotionalImpact: memory.emotionalImpact,
      timestamp: new Date(),
    };

    // Store in database
    await query(
      "INSERT INTO memories (id, agent_id, content, type, related_agent, location, emotional_impact, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        memoryId,
        agentId,
        memoryData.content,
        memoryData.type,
        memoryData.relatedAgent,
        memoryData.location,
        memoryData.emotionalImpact,
        memoryData.timestamp,
      ]
    );

    // Store with embedding
    await embeddingClient.storeMemory(agentId, memoryData);
  }

  // Log event
  async logEvent(agentId, agentName, type, description, location) {
    await query(
      "INSERT INTO events (agent_id, agent_name, type, description, location, timestamp) VALUES ($1, $2, $3, $4, $5, $6)",
      [agentId, agentName, type, description, location, new Date()]
    );
  }

  // Helper methods
  async getCurrentTime() {
    const result = await query("SELECT * FROM world_state WHERE id = 1");
    return result.rows[0];
  }

  async getNearbyAgents(location) {
    const result = await query(
      "SELECT id, name FROM agents WHERE current_location = $1",
      [location]
    );
    return result.rows;
  }

  async getRecentEvents(location, limit) {
    const result = await query(
      "SELECT * FROM events WHERE location = $1 ORDER BY timestamp DESC LIMIT $2",
      [location, limit]
    );
    return result.rows;
  }

  async getRecentMemories(agentId, limit) {
    return embeddingClient.getRecentMemories(agentId, limit);
  }

  formatContext(context) {
    return `
Current time: ${context.currentTime.hour}:${context.currentTime.minute}
Location: ${context.location}
Nearby agents: ${context.nearbyAgents.map((a) => a.name).join(", ") || "none"}
Recent events: ${
      context.recentEvents.map((e) => e.description).join("; ") || "none"
    }
Recent memories: ${
      context.recentMemories.map((m) => m.content).join("; ") || "none"
    }
    `.trim();
  }

  getMoodDescription(mood) {
    if (mood >= 0.7) return "very happy";
    if (mood >= 0.3) return "happy";
    if (mood >= -0.3) return "neutral";
    if (mood >= -0.7) return "sad";
    return "very sad";
  }

  getRandomLocation(currentLocation) {
    const locations = ["cafe", "library", "park", "home"];
    const otherLocations = locations.filter((loc) => loc !== currentLocation);
    return otherLocations[Math.floor(Math.random() * otherLocations.length)];
  }
}

export default new AgentThinker();
