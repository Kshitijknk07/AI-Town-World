# 🏗️ AI Town Backend

A comprehensive Node.js backend for AI Town World - a real-time AI agent simulation platform with local LLM integration, vector memory systems, and WebSocket communication.

## 🌟 Overview

The AI Town Backend is a robust, scalable Node.js application that powers the AI agent simulation. It provides real-time agent thinking, memory management, world simulation, and a complete REST API with WebSocket support for live frontend updates.

### 🎯 Core Capabilities

- **🧠 Agent Intelligence**: Each agent thinks and acts autonomously using local LLM
- **🗣️ Natural Language Processing**: Ollama integration for agent conversations
- **📜 Vector Memory System**: Persistent, searchable agent memories
- **⏰ World Simulation**: Real-time time progression and event scheduling
- **🔌 WebSocket Communication**: Live updates to frontend clients
- **🗄️ PostgreSQL Database**: Robust data persistence and relationships
- **📊 Event Logging**: Comprehensive simulation event tracking
- **🔧 RESTful API**: Complete CRUD operations for all entities

## 🏗️ Architecture

```
backend/
├── index.js                 # Main server entry point
├── simulationLoop.js        # Core simulation engine
├── agents/
│   └── thinker.js          # Agent thinking and decision logic
├── llm/
│   └── ollamaClient.js     # Ollama LLM integration
├── api/
│   └── routes.js           # REST API endpoints (471 lines)
├── sockets/
│   └── socketHandler.js    # WebSocket event handling
├── data/
│   ├── db.js              # Database connection and operations
│   └── seed.js            # Sample data generation
├── world/
│   ├── time.js            # World time simulation
│   └── buildings.js       # Town building definitions
├── vector/
│   └── embeddingClient.js # Vector memory operations
├── events/
│   └── eventManager.js    # Event system management
├── utils/
│   └── logger.js          # Winston logging system
├── config/
│   └── config.js          # Configuration management
└── package.json           # Dependencies and scripts
```

## 🛠️ Technology Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL 12+
- **LLM**: Ollama (Mistral 7B recommended)
- **Real-time**: Socket.io 4.7+
- **Vector Store**: In-memory with embedding support
- **Logging**: Winston 3.11+
- **Validation**: Joi 17.11+

### Key Dependencies
- **AI/ML**: TensorFlow.js, ONNX Runtime, Natural
- **Security**: Helmet, CORS, bcryptjs, JWT
- **Utilities**: UUID, node-cron, node-fetch
- **Development**: Nodemon, Jest, Supertest

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **PostgreSQL 12+** with proper permissions
- **Ollama** installed and running
- **Git** for version control

### Installation

1. **Clone and Navigate**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb ai_town_world
   
   # Seed with sample data
   pnpm run db:seed
   ```

5. **Install Ollama Model**
   ```bash
   # Install Ollama if not already installed
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull recommended model
   ollama pull mistral:instruct
   ```

6. **Start Development Server**
   ```bash
   pnpm dev
   ```

The server will start on `http://localhost:3001`

## 🔧 Configuration

### Environment Variables (.env)

```env
# Server Configuration
PORT=3001
HOST=localhost
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_town_world
DB_USER=your_username
DB_PASSWORD=your_password
DB_POOL_SIZE=10

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral:instruct
OLLAMA_TIMEOUT=30000

# Simulation Configuration
SIMULATION_TICK_RATE=5000
AGENT_THINK_INTERVAL=10000
WORLD_TIME_SPEED=1
MAX_AGENTS=50
MAX_MEMORIES_PER_AGENT=1000

# Vector/Embedding Configuration
VECTOR_DIMENSION=384
SIMILARITY_THRESHOLD=0.7
MAX_MEMORY_SEARCH_RESULTS=10

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5

# Security Configuration
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Documentation

### Health & Status

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "database": "connected",
  "ollama": "connected"
}
```

### Agents API

#### Get All Agents
```http
GET /api/agents?limit=10&offset=0&status=active
```

#### Get Agent by ID
```http
GET /api/agents/:id
```

#### Create New Agent
```http
POST /api/agents
Content-Type: application/json

{
  "name": "Alex",
  "personality": {
    "traits": ["curious", "friendly", "artistic"],
    "background": "A local artist who loves nature",
    "interests": ["art", "nature", "photography"],
    "communication_style": "warm and expressive",
    "goals": ["create beautiful art", "make friends", "explore the town"]
  },
  "current_location": "cafe",
  "current_goal": "Find inspiration for a new painting",
  "avatar": "🎨",
  "energy": 100,
  "mood": "inspired"
}
```

#### Update Agent
```http
PUT /api/agents/:id
Content-Type: application/json

{
  "current_goal": "Paint a masterpiece of the town square",
  "energy": 85,
  "mood": "focused"
}
```

#### Delete Agent
```http
DELETE /api/agents/:id
```

#### Trigger Agent Thinking
```http
POST /api/agents/:id/thought
```

#### Get Agent Memories
```http
GET /api/agents/:id/memories?limit=10&search=inspiration&type=conversation
```

#### Get Agent Relationships
```http
GET /api/agents/:id/relationships
```

### World API

#### Get World Time
```http
GET /api/world/time
```
**Response:**
```json
{
  "current_time": "2024-01-15T10:30:00.000Z",
  "day_of_week": "Monday",
  "hour": 10,
  "minute": 30,
  "simulation_speed": "normal",
  "is_daytime": true
}
```

#### Set Simulation Speed
```http
POST /api/world/speed
Content-Type: application/json

{
  "speed": "fast" // "slow", "normal", "fast", "ultra"
}
```

#### Reset World Time
```http
POST /api/world/reset
```

#### Get Buildings
```http
GET /api/world/buildings
```

#### Get Locations
```http
GET /api/world/locations
```

### Events API

#### Get Events
```http
GET /api/events?limit=50&agent_id=123&location=cafe&type=conversation
```

#### Create Event
```http
POST /api/events
Content-Type: application/json

{
  "type": "conversation",
  "agent_id": "123",
  "target_agent_id": "456",
  "location": "cafe",
  "description": "Alex and Sarah discussed art techniques",
  "metadata": {
    "topic": "art",
    "sentiment": "positive"
  }
}
```

### Simulation API

#### Get Simulation Status
```http
GET /api/simulation/status
```

#### Control Simulation
```http
POST /api/simulation/start
POST /api/simulation/stop
POST /api/simulation/pause
POST /api/simulation/resume
POST /api/simulation/reset
```

#### Get Statistics
```http
GET /api/simulation/stats
```

### Chat API

#### Get Chat Messages
```http
GET /api/agents/:id/chat?limit=50&with_agent=456
```

#### Send Message to Agent
```http
POST /api/agents/:id/chat
Content-Type: application/json

{
  "message": "Hello! How are you today?",
  "target_agent_id": "456"
}
```

### LLM API

#### Health Check
```http
GET /api/llm/health
```

#### Get Available Models
```http
GET /api/llm/models
```

#### Test LLM Response
```http
POST /api/llm/test
Content-Type: application/json

{
  "prompt": "What should I do today?",
  "context": "I'm an artist looking for inspiration"
}
```

## 🔌 WebSocket Events

### Client to Server Events

#### Join Agent Room
```javascript
socket.emit('join:agent', { agentId: '123' });
```

#### Leave Agent Room
```javascript
socket.emit('leave:agent', { agentId: '123' });
```

#### Control Simulation
```javascript
socket.emit('simulation:start');
socket.emit('simulation:stop');
socket.emit('simulation:pause');
socket.emit('simulation:resume');
socket.emit('simulation:reset');
```

#### Set World Speed
```javascript
socket.emit('world:speed', { speed: 'fast' });
```

#### Trigger Agent Thought
```javascript
socket.emit('agent:trigger-thought', { agentId: '123' });
```

### Server to Client Events

#### Simulation Status
```javascript
socket.on('simulation:status', (data) => {
  console.log('Simulation status:', data);
  // { isRunning: true, speed: 'normal', agents: 5 }
});
```

#### World Time Update
```javascript
socket.on('world:time', (data) => {
  console.log('World time:', data);
  // { current_time: '2024-01-15T10:30:00.000Z', hour: 10, minute: 30 }
});
```

#### Agent Updates
```javascript
socket.on('agent:update', (data) => {
  console.log('Agent updated:', data);
  // { id: '123', name: 'Alex', location: 'cafe', goal: 'Find inspiration' }
});

socket.on('agent:movement', (data) => {
  console.log('Agent moved:', data);
  // { agentId: '123', from: 'home', to: 'cafe', timestamp: '...' }
});

socket.on('agent:thought', (data) => {
  console.log('Agent thought:', data);
  // { agentId: '123', thought: 'I should visit the cafe for inspiration', timestamp: '...' }
});

socket.on('agent:action', (data) => {
  console.log('Agent action:', data);
  // { agentId: '123', action: 'walked to cafe', timestamp: '...' }
});
```

#### Events and Memories
```javascript
socket.on('event:new', (data) => {
  console.log('New event:', data);
  // { type: 'conversation', agent_id: '123', description: '...' }
});

socket.on('memory:new', (data) => {
  console.log('New memory:', data);
  // { agentId: '123', memory: 'Had a great conversation about art', timestamp: '...' }
});
```

#### Chat Messages
```javascript
socket.on('chat:message', (data) => {
  console.log('Chat message:', data);
  // { from: '123', to: '456', message: 'Hello!', timestamp: '...' }
});
```

#### Relationship Updates
```javascript
socket.on('relationship:update', (data) => {
  console.log('Relationship update:', data);
  // { agent1: '123', agent2: '456', relationship: 'friends', strength: 0.8 }
});
```

## 🧪 Development

### Project Structure Deep Dive

#### Core Modules

**`index.js`** - Main Server Entry Point
- Express server setup and configuration
- Middleware initialization (CORS, Helmet, Morgan)
- Database connection and health checks
- WebSocket server initialization
- Simulation loop startup
- Graceful shutdown handling

**`simulationLoop.js`** - Simulation Engine
- Time-based simulation loop
- Agent thinking scheduling
- World time progression
- Event generation and processing
- Performance monitoring and optimization

**`agents/thinker.js`** - Agent Intelligence
- LLM integration for agent reasoning
- Decision-making algorithms
- Goal planning and execution
- Memory retrieval and storage
- Personality-driven behavior

**`llm/ollamaClient.js`** - LLM Integration
- Ollama API communication
- Prompt engineering and formatting
- Response parsing and validation
- Error handling and fallbacks
- Model management and switching

**`api/routes.js`** - REST API
- Complete CRUD operations for all entities
- Input validation using Joi
- Error handling and response formatting
- Rate limiting and security
- API documentation and examples

**`sockets/socketHandler.js`** - Real-time Communication
- WebSocket connection management
- Room-based event broadcasting
- Client authentication and authorization
- Event filtering and optimization
- Connection monitoring and cleanup

### Adding New Features

#### 1. New API Endpoint

```javascript
// In api/routes.js
router.get('/api/new-feature', async (req, res) => {
  try {
    const result = await newFeatureService.getData();
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error in new-feature endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

#### 2. New WebSocket Event

```javascript
// In sockets/socketHandler.js
socket.on('new:event', async (data) => {
  try {
    const result = await handleNewEvent(data);
    socket.emit('new:event:response', result);
  } catch (error) {
    socket.emit('error', { message: 'Failed to process event' });
  }
});
```

#### 3. New Agent Behavior

```javascript
// In agents/thinker.js
async function newBehavior(agent) {
  const prompt = `As ${agent.name}, consider: ${agent.current_goal}`;
  const response = await ollamaClient.generate(prompt);
  return processBehaviorResponse(response);
}
```

### Testing

#### Unit Tests
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test agents/thinker.test.js

# Run tests with coverage
pnpm test -- --coverage
```

#### Integration Tests
```bash
# Test API endpoints
pnpm test:integration

# Test WebSocket events
pnpm test:websocket
```

#### Load Testing
```bash
# Test with multiple agents
pnpm test:load

# Test WebSocket connections
pnpm test:websocket-load
```

### Code Quality

#### Linting
```bash
# Run ESLint
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix
```

#### Type Checking
```bash
# Check for type errors
pnpm type-check
```

## 🔍 Monitoring and Debugging

### Logging

The backend uses Winston for comprehensive logging:

```javascript
// Different log levels
logger.error('Critical error occurred', { error, context });
logger.warn('Warning message', { data });
logger.info('Information message', { details });
logger.debug('Debug information', { debugData });
```

### Health Monitoring

#### Database Health
```javascript
// Automatic connection monitoring
db.on('error', (err) => {
  logger.error('Database connection error:', err);
});

db.on('connect', () => {
  logger.info('Database connected successfully');
});
```

#### Ollama Health
```javascript
// Regular health checks
setInterval(async () => {
  try {
    await ollamaClient.healthCheck();
    logger.debug('Ollama health check passed');
  } catch (error) {
    logger.error('Ollama health check failed:', error);
  }
}, 30000);
```

### Performance Monitoring

#### Agent Thinking Performance
```javascript
// Monitor agent thinking time
const startTime = Date.now();
const result = await agent.think();
const duration = Date.now() - startTime;

if (duration > 5000) {
  logger.warn('Slow agent thinking detected', { agentId, duration });
}
```

#### Database Query Performance
```javascript
// Monitor slow queries
const queryStart = Date.now();
const result = await db.query(sql, params);
const queryDuration = Date.now() - queryStart;

if (queryDuration > 1000) {
  logger.warn('Slow database query detected', { sql, duration: queryDuration });
}
```

## 🚀 Deployment

### Production Setup

#### Environment Configuration
```bash
NODE_ENV=production
PORT=3001
DB_HOST=your_production_db_host
DB_PASSWORD=your_secure_password
OLLAMA_BASE_URL=http://your_ollama_server:11434
LOG_LEVEL=warn
```

#### Database Migration
```bash
# Run migrations
pnpm run db:migrate

# Verify database setup
pnpm run db:verify
```

#### Process Management
```bash
# Using PM2
pm2 start ecosystem.config.js

# Using Docker
docker-compose up -d
```

### Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start application
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - OLLAMA_BASE_URL=http://ollama:11434
    depends_on:
      - postgres
      - ollama

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ai_town_world
      POSTGRES_USER: ai_town
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

volumes:
  postgres_data:
  ollama_data:
```

## 🔒 Security

### API Security
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Joi schema validation
- **SQL Injection Prevention**: Parameterized queries

### Authentication
```javascript
// JWT token validation
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

## 📊 Performance Optimization

### Database Optimization
- Connection pooling
- Query optimization
- Index creation
- Regular maintenance

### Memory Management
- Garbage collection monitoring
- Memory leak detection
- Resource cleanup

### Caching Strategy
- Redis for session storage
- In-memory caching for frequently accessed data
- Database query result caching

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests for new functionality**
5. **Ensure code quality**
   ```bash
   pnpm lint
   pnpm test
   pnpm type-check
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
7. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Code Standards

- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Conventional Commits**: Use conventional commit messages
- **TypeScript**: Use TypeScript for type safety
- **Documentation**: Document new APIs and features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern Node.js best practices
- Inspired by Stanford's Smallville project
- Designed for AI research and development
- Community-driven development

---

**Ready to build amazing AI experiences? Let's create something incredible! 🚀**

*AI Town Backend - Powering the future of AI simulation* 