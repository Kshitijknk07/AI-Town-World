import fetch from "node-fetch";
import config from "../config/config.js";
import logger from "../utils/logger.js";

class EmbeddingClient {
  constructor() {
    this.baseUrl = config.llm.baseUrl;
    this.dimension = config.vector.dimension;
    this.similarityThreshold = config.vector.similarityThreshold;
    this.maxResults = config.vector.maxResults;

    this.embeddings = new Map();
  }

  async generateEmbedding(text) {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nomic-embed-text",
          prompt: text,
        }),
        timeout: 10000,
      });

      if (!response.ok) {
        throw new Error(`Embedding API error: ${response.status}`);
      }

      const data = await response.json();
      return data.embedding;
    } catch (error) {
      logger.error("Failed to generate embedding", {
        error: error.message,
        text: text.substring(0, 100),
      });

      return this.generateFallbackEmbedding(text);
    }
  }

  generateFallbackEmbedding(text) {
    const hash = this.simpleHash(text);
    const embedding = new Array(this.dimension).fill(0);

    for (let i = 0; i < this.dimension; i++) {
      embedding[i] = Math.sin(hash + i) * 0.5;
    }

    return embedding;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      throw new Error("Vectors must have the same dimension");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  async storeMemory(agentId, memory) {
    try {
      const embedding = await this.generateEmbedding(memory.content);

      if (!this.embeddings.has(agentId)) {
        this.embeddings.set(agentId, []);
      }

      const memoryWithEmbedding = {
        id: memory.id,
        content: memory.content,
        type: memory.type,
        relatedAgent: memory.relatedAgent,
        location: memory.location,
        emotionalImpact: memory.emotionalImpact,
        timestamp: memory.timestamp,
        embedding: embedding,
      };

      this.embeddings.get(agentId).push(memoryWithEmbedding);

      logger.debug("Stored memory with embedding", {
        agentId,
        memoryId: memory.id,
        embeddingLength: embedding.length,
      });

      return memoryWithEmbedding;
    } catch (error) {
      logger.error("Failed to store memory with embedding", {
        error: error.message,
        agentId,
      });
      throw error;
    }
  }

  async searchMemories(agentId, query, limit = this.maxResults) {
    try {
      if (!this.embeddings.has(agentId)) {
        return [];
      }

      const queryEmbedding = await this.generateEmbedding(query);
      const agentMemories = this.embeddings.get(agentId);

      const similarities = agentMemories.map((memory) => ({
        memory,
        similarity: this.cosineSimilarity(queryEmbedding, memory.embedding),
      }));

      const filtered = similarities
        .filter((item) => item.similarity >= this.similarityThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      logger.debug("Memory search completed", {
        agentId,
        queryLength: query.length,
        totalMemories: agentMemories.length,
        resultsFound: filtered.length,
        maxSimilarity: filtered[0]?.similarity || 0,
      });

      return filtered.map((item) => ({
        ...item.memory,
        similarity: item.similarity,
      }));
    } catch (error) {
      logger.error("Failed to search memories", {
        error: error.message,
        agentId,
        query,
      });
      return [];
    }
  }

  getRecentMemories(agentId, limit = this.maxResults) {
    if (!this.embeddings.has(agentId)) {
      return [];
    }

    const agentMemories = this.embeddings.get(agentId);
    return agentMemories
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .map((memory) => ({
        id: memory.id,
        content: memory.content,
        type: memory.type,
        relatedAgent: memory.relatedAgent,
        location: memory.location,
        emotionalImpact: memory.emotionalImpact,
        timestamp: memory.timestamp,
      }));
  }

  cleanupOldMemories(agentId, daysOld = config.simulation.memoryRetentionDays) {
    if (!this.embeddings.has(agentId)) {
      return;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const agentMemories = this.embeddings.get(agentId);
    const filteredMemories = agentMemories.filter(
      (memory) => new Date(memory.timestamp) > cutoffDate
    );

    this.embeddings.set(agentId, filteredMemories);

    logger.info("Cleaned up old memories", {
      agentId,
      removed: agentMemories.length - filteredMemories.length,
      remaining: filteredMemories.length,
    });
  }

  getMemoryStats(agentId) {
    if (!this.embeddings.has(agentId)) {
      return { total: 0, byType: {} };
    }

    const memories = this.embeddings.get(agentId);
    const byType = memories.reduce((acc, memory) => {
      acc[memory.type] = (acc[memory.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total: memories.length,
      byType,
    };
  }

  async healthCheck() {
    try {
      const testEmbedding = await this.generateEmbedding("test");
      return testEmbedding.length === this.dimension;
    } catch (error) {
      logger.error("Embedding health check failed", { error: error.message });
      return false;
    }
  }
}

export default new EmbeddingClient();
