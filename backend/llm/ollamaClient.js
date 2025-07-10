import fetch from "node-fetch";
import config from "../config/config.js";
import logger from "../utils/logger.js";

class OllamaClient {
  constructor() {
    this.baseUrl = config.llm.baseUrl;
    this.model = config.llm.model;
    this.temperature = config.llm.temperature;
    this.maxTokens = config.llm.maxTokens;
    this.timeout = config.llm.timeout;
  }

  // Generate text using Ollama
  async generate(prompt, options = {}) {
    const {
      temperature = this.temperature,
      maxTokens = this.maxTokens,
      model = this.model,
      systemPrompt = null,
    } = options;

    try {
      const requestBody = {
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: temperature,
          num_predict: maxTokens,
          top_p: 0.9,
          top_k: 40,
          repeat_penalty: 1.1,
        },
      };

      // Add system prompt if provided
      if (systemPrompt) {
        requestBody.system = systemPrompt;
      }

      logger.debug("Sending request to Ollama", {
        model,
        promptLength: prompt.length,
        temperature,
        maxTokens,
      });

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        timeout: this.timeout,
      });

      if (!response.ok) {
        throw new Error(
          `Ollama API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      logger.debug("Received response from Ollama", {
        model,
        responseLength: data.response?.length || 0,
        usage: data.usage,
      });

      return {
        text: data.response,
        usage: data.usage,
        model: data.model,
      };
    } catch (error) {
      logger.error("Ollama generation failed", {
        error: error.message,
        model,
        promptLength: prompt.length,
      });
      throw error;
    }
  }

  // Generate agent thought
  async generateThought(agent, context) {
    const systemPrompt = `You are ${
      agent.name
    }, a resident of AI Town. You have the following personality: ${JSON.stringify(
      agent.personality
    )}.

You are currently at ${agent.current_location} and your current goal is: ${
      agent.current_goal
    }.

Respond naturally as this character would think. Keep your response concise (1-2 sentences) and in first person.`;

    const prompt = `Context: ${context}

Based on this context, what are you thinking about right now?`;

    const result = await this.generate(prompt, {
      systemPrompt,
      temperature: 0.8,
      maxTokens: 100,
    });

    return result.text.trim();
  }

  // Generate agent action
  async generateAction(agent, context, availableActions) {
    const systemPrompt = `You are ${
      agent.name
    }, a resident of AI Town. You have the following personality: ${JSON.stringify(
      agent.personality
    )}.

You are currently at ${agent.current_location} and your current goal is: ${
      agent.current_goal
    }.

Available actions: ${availableActions.join(", ")}

Respond with ONLY the action you want to take, nothing else.`;

    const prompt = `Context: ${context}

What action do you want to take? Choose from: ${availableActions.join(", ")}`;

    const result = await this.generate(prompt, {
      systemPrompt,
      temperature: 0.7,
      maxTokens: 50,
    });

    return result.text.trim();
  }

  // Generate dialogue response
  async generateDialogue(agent, message, context) {
    const systemPrompt = `You are ${
      agent.name
    }, a resident of AI Town. You have the following personality: ${JSON.stringify(
      agent.personality
    )}.

You are currently at ${agent.current_location} and your current goal is: ${
      agent.current_goal
    }.

Respond naturally as this character would speak. Keep your response conversational and in character.`;

    const prompt = `Context: ${context}

Someone says to you: "${message}"

How do you respond?`;

    const result = await this.generate(prompt, {
      systemPrompt,
      temperature: 0.8,
      maxTokens: 150,
    });

    return result.text.trim();
  }

  // Generate memory reflection
  async generateMemoryReflection(agent, memory, context) {
    const systemPrompt = `You are ${
      agent.name
    }, a resident of AI Town. You have the following personality: ${JSON.stringify(
      agent.personality
    )}.

Reflect on this memory from your perspective. How does it make you feel? What does it mean to you?`;

    const prompt = `Memory: ${memory}

Context: ${context}

How do you feel about this memory?`;

    const result = await this.generate(prompt, {
      systemPrompt,
      temperature: 0.7,
      maxTokens: 100,
    });

    return result.text.trim();
  }

  // Check if Ollama is available
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
        timeout: 5000,
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const hasModel = data.models?.some((model) => model.name === this.model);

      logger.info("Ollama health check", {
        available: true,
        model: this.model,
        hasModel,
        totalModels: data.models?.length || 0,
      });

      return hasModel;
    } catch (error) {
      logger.error("Ollama health check failed", { error: error.message });
      return false;
    }
  }

  // List available models
  async listModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
        timeout: 5000,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.models || [];
    } catch (error) {
      logger.error("Failed to list Ollama models", { error: error.message });
      throw error;
    }
  }
}

export default new OllamaClient();
