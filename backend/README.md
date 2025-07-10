# AI Town Backend

A comprehensive Node.js backend for AI Town World - a self-contained virtual town simulation where AI agents live, interact, form memories, and evolve locally without cloud dependencies.

## 🚀 Features

- **🧠 Agent Simulation**: Each agent "thinks" and updates every few seconds
- **🗣️ LLM Integration**: Local LLM (Ollama) for agent reasoning and dialogue
- **📜 Memory System**: Vector-based memory storage and retrieval
- **🗺️ World State**: Real-time simulation clock and location tracking
- **📡 Real-time Updates**: WebSocket support for live frontend updates
- **🗄️ PostgreSQL Database**: Robust data persistence
- **🔧 RESTful API**: Complete CRUD operations for all entities
- **📊 Event Logging**: Comprehensive event tracking system

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **LLM**: Ollama (Mistral 7B)
- **Real-time**: Socket.io
- **Vector Store**: In-memory with embedding support
- **Logging**: Winston
- **Validation**: Joi

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Ollama (for local LLM)
- Git

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd backend
npm install
```

### 2. Environment Configuration

```bash
cp env.example .env
# Edit .env with your configuration
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb ai_town_world

# Run migrations (tables are auto-created)
npm run db:seed
```

### 4. Install Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull Mistral model
ollama pull mistral:instruct
```

### 5. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Agents

#### Get All Agents
```http
GET /api/agents
```

#### Get Agent by ID
```http
GET /api/agents/:id
```

#### Create Agent
```http
POST /api/agents
Content-Type: application/json

{
  "name": "Alex",
  "personality": {
    "traits": ["curious", "friendly"],
    "background": "A local artist",
    "interests": ["art", "nature"],
    "communication_style": "warm"
  },
  "current_location": "cafe",
  "current_goal": "Find inspiration",
  "avatar": "🎨"
}
```

#### Update Agent
```http
PUT /api/agents/:id
Content-Type: application/json

{
  "current_goal": "Paint a masterpiece",
  "energy": 85
}
```

#### Delete Agent
```http
DELETE /api/agents/:id
```

#### Trigger Agent Thought
```http
POST /api/agents/:id/thought
```

#### Get Agent Memories
```http
GET /api/agents/:id/memories?limit=10&search=inspiration
```

### World

#### Get World Time
```http
GET /api/world/time
```

#### Set Simulation Speed
```http
POST /api/world/speed
Content-Type: application/json

{
  "speed": "fast"
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

### Events

#### Get Events
```http
GET /api/events?limit=50&agent_id=123&location=cafe
```

### Simulation

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

### Chat

#### Get Chat Messages
```http
GET /api/agents/:id/chat?limit=50
```

#### Send Message to Agent
```http
POST /api/agents/:id/chat
Content-Type: application/json

{
  "message": "Hello! How are you today?"
}
```

### LLM

#### Health Check
```http
GET /api/llm/health
```

#### Get Available Models
```http
GET /api/llm/models
```

## 🔌 WebSocket Events

### Client to Server

- `join:agent` - Join agent-specific room
- `leave:agent` - Leave agent-specific room
- `simulation:start` - Start simulation
- `simulation:stop` - Stop simulation
- `simulation:pause` - Pause simulation
- `simulation:resume` - Resume simulation
- `simulation:reset` - Reset simulation
- `world:speed` - Set simulation speed
- `agent:trigger-thought` - Trigger agent thinking

### Server to Client

- `simulation:status` - Simulation status update
- `world:time` - World time update
- `agent:update` - Agent state update
- `agent:movement` - Agent location change
- `agent:thought` - New agent thought
- `agent:action` - Agent action performed
- `event:new` - New event logged
- `memory:new` - New memory created
- `chat:message` - New chat message
- `relationship:update` - Relationship change
- `building:update` - Building state change
- `system:message` - System notification
- `system:error` - Error notification

## 🏗️ Project Structure

```
backend/
├── agents/              # Agent simulation logic
│   └── thinker.js       # Agent reasoning and actions
├── api/                 # REST API routes
│   └── routes.js        # All API endpoints
├── config/              # Configuration
│   └── config.js        # App configuration
├── data/                # Database layer
│   ├── db.js           # Database connection
│   └── seed.js         # Sample data seeding
├── events/              # Event system
├── llm/                 # LLM integration
│   └── ollamaClient.js  # Ollama client
├── sockets/             # WebSocket handling
│   └── socketHandler.js # Socket.io events
├── utils/               # Utilities
│   └── logger.js        # Winston logger
├── vector/              # Vector operations
│   └── embeddingClient.js # Embedding generation
├── world/               # World simulation
│   └── time.js          # Time management
├── simulationLoop.js    # Main simulation loop
├── index.js             # Server entry point
└── package.json         # Dependencies
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_NAME` | Database name | `ai_town_world` |
| `OLLAMA_BASE_URL` | Ollama API URL | `http://localhost:11434` |
| `OLLAMA_MODEL` | LLM model name | `mistral:instruct` |
| `TICK_INTERVAL` | Simulation tick interval (ms) | `5000` |
| `TIME_SCALE` | Time acceleration factor | `1` |

### Simulation Settings

- **Tick Interval**: How often agents think (default: 5 seconds)
- **Time Scale**: Virtual time acceleration (default: 1 real second = 1 virtual minute)
- **Max Agents**: Maximum number of agents (default: 10)
- **Memory Retention**: Days to keep memories (default: 30)

## 🧪 Development

### Running Tests

```bash
npm test
```

### Database Migrations

```bash
# Seed with sample data
npm run db:seed

# Clear and reseed
npm run db:seed
```

### Logs

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

### Debug Mode

```bash
LOG_LEVEL=debug npm run dev
```

## 🚀 Production Deployment

### 1. Environment Setup

```bash
NODE_ENV=production
PORT=3001
DB_HOST=your-db-host
DB_PASSWORD=your-secure-password
JWT_SECRET=your-secure-jwt-secret
```

### 2. Database Setup

```bash
# Create production database
createdb ai_town_world_prod

# Run migrations
npm run db:seed
```

### 3. Process Management

```bash
# Using PM2
npm install -g pm2
pm2 start index.js --name "ai-town-backend"

# Using Docker
docker build -t ai-town-backend .
docker run -p 3001:3001 ai-town-backend
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Ollama Not Responding**
   - Check Ollama is running: `ollama serve`
   - Verify model is installed: `ollama list`
   - Check Ollama URL in `.env`

3. **Memory Issues**
   - Reduce `MAX_AGENTS` in config
   - Increase `TICK_INTERVAL`
   - Monitor memory usage

4. **WebSocket Connection Failed**
   - Check CORS settings
   - Verify frontend URL in `.env`
   - Check firewall settings

### Performance Tuning

- **High Agent Count**: Increase `TICK_INTERVAL`
- **Slow Responses**: Reduce `LLM_MAX_TOKENS`
- **Memory Usage**: Lower `VECTOR_DIMENSION`
- **Database**: Add connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**AI Town Backend** - Powering the future of AI agent simulation! 🏘️🤖 