# 🏘️ AI Town World

A comprehensive, real-time AI agent simulation platform where intelligent agents live, interact, form memories, and evolve in a virtual town - all running locally without external dependencies.

## 🌟 Overview

AI Town World is a full-stack application that simulates a living, breathing virtual town populated by AI agents. Each agent has unique personalities, memories, goals, and the ability to interact with other agents and the environment. The simulation runs in real-time with a beautiful web interface for monitoring and interaction.

### 🎯 Key Features

- **🧠 Intelligent Agents**: Each agent thinks, plans, and acts autonomously
- **🗣️ Natural Conversations**: Agents communicate using local LLM (Ollama)
- **📜 Persistent Memory**: Vector-based memory system for long-term recall
- **🏠 Living World**: Dynamic town with buildings, locations, and events
- **⏰ Real-time Simulation**: Time progresses with realistic scheduling
- **🎨 Beautiful UI**: Modern React frontend with real-time updates
- **🔌 WebSocket Integration**: Live updates between frontend and backend
- **🗄️ Data Persistence**: PostgreSQL database with comprehensive logging
- **🔧 Developer Tools**: Built-in debugging and monitoring tools

## 🏗️ Architecture

```
AI-Town-World/
├── backend/                 # Node.js/Express backend
│   ├── agents/             # Agent simulation logic
│   ├── llm/               # Ollama LLM integration
│   ├── api/               # REST API endpoints
│   ├── sockets/           # WebSocket handlers
│   ├── data/              # Database and seeding
│   ├── world/             # World simulation
│   ├── vector/            # Memory/embedding system
│   ├── events/            # Event system
│   ├── utils/             # Utilities and helpers
│   └── config/            # Configuration files
├── frontend/               # React/TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/         # Zustand state management
│   │   ├── types/         # TypeScript definitions
│   │   ├── utils/         # Frontend utilities
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (for both frontend and backend)
- **PostgreSQL 12+** (for data persistence)
- **Ollama** (for local LLM processing)
- **Git** (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Town-World
   ```

2. **Install Ollama**
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull a model (recommended: Mistral 7B)
   ollama pull mistral:instruct
   ```

3. **Setup Database**
   ```bash
   # Create PostgreSQL database
   createdb ai_town_world
   ```

4. **Configure Backend**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your database and Ollama settings
   pnpm install
   pnpm run db:seed
   ```

5. **Configure Frontend**
   ```bash
   cd ../frontend
   pnpm install
   ```

6. **Start the Application**
   ```bash
   # Terminal 1: Start backend
   cd backend
   pnpm dev
   
   # Terminal 2: Start frontend
   cd frontend
   pnpm dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/health

## 🎮 Usage Guide

### Starting the Simulation

1. Open the frontend in your browser
2. The simulation will start automatically with sample agents
3. Use the time controls to adjust simulation speed
4. Monitor agent activities in the event log

### Interacting with Agents

1. **View Agent Details**: Click on any agent on the town map
2. **Chat with Agents**: Use the chat window to send messages
3. **Monitor Memories**: View agent memories in the memory viewer
4. **Track Relationships**: See how agents interact and form bonds

### Developer Tools

1. **Event Log**: Real-time view of all simulation events
2. **Memory Viewer**: Browse agent memories and knowledge
3. **Dev Tools**: Advanced debugging and monitoring
4. **API Explorer**: Test backend endpoints directly

## 🔧 Configuration

### Backend Configuration (.env)

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

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral:instruct

# Simulation Configuration
SIMULATION_TICK_RATE=5000
AGENT_THINK_INTERVAL=10000
WORLD_TIME_SPEED=1

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### Frontend Configuration

The frontend automatically connects to the backend. No additional configuration needed.

## 📚 API Documentation

### Core Endpoints

- `GET /health` - Server health check
- `GET /api/agents` - List all agents
- `GET /api/agents/:id` - Get specific agent
- `POST /api/agents/:id/thought` - Trigger agent thinking
- `GET /api/world/time` - Get current world time
- `GET /api/events` - Get simulation events
- `POST /api/simulation/start` - Start simulation
- `POST /api/simulation/stop` - Stop simulation

### WebSocket Events

- `agent:update` - Agent state changes
- `world:time` - Time progression updates
- `event:new` - New simulation events
- `memory:new` - New agent memories
- `chat:message` - New chat messages

## 🧪 Development

### Project Structure

#### Backend Modules

- **`agents/thinker.js`**: Core agent thinking and decision-making
- **`llm/ollamaClient.js`**: Local LLM integration
- **`api/routes.js`**: REST API endpoints
- **`sockets/socketHandler.js`**: WebSocket real-time updates
- **`simulationLoop.js`**: Main simulation engine
- **`data/db.js`**: Database connection and operations
- **`data/seed.js`**: Sample data generation

#### Frontend Components

- **`Header.tsx`**: Application header with controls
- **`Sidebar.tsx`**: Navigation and agent list
- **`TownMap.tsx`**: Visual town representation
- **`AgentCard.tsx`**: Individual agent display
- **`ChatWindow.tsx`**: Agent communication interface
- **`EventLog.tsx`**: Real-time event monitoring
- **`MemoryViewer.tsx`**: Agent memory exploration
- **`DevTools.tsx`**: Development and debugging tools

### Adding New Features

1. **Backend**: Add new endpoints in `api/routes.js`
2. **Frontend**: Create new components in `src/components/`
3. **State Management**: Update Zustand store in `src/store/`
4. **Types**: Add TypeScript definitions in `src/types/`

### Testing

```bash
# Backend tests
cd backend
pnpm test

# Frontend tests
cd frontend
pnpm test
```

## 🔍 Monitoring and Debugging

### Logs

- Backend logs are stored in `backend/logs/`
- Use `LOG_LEVEL=debug` for detailed logging
- Frontend console logs for client-side debugging

### Health Checks

- Backend: `GET /health`
- Database: Automatic connection monitoring
- Ollama: Automatic health checks

### Performance Monitoring

- Agent thinking intervals
- Database query performance
- WebSocket connection status
- Memory usage tracking

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=3001
   DB_HOST=your_production_db
   OLLAMA_BASE_URL=http://your_ollama_server:11434
   ```

2. **Database Migration**
   ```bash
   cd backend
   pnpm run db:migrate
   ```

3. **Build Frontend**
   ```bash
   cd frontend
   pnpm build
   ```

4. **Start Services**
   ```bash
   # Backend
   cd backend
   pnpm start
   
   # Serve frontend (using nginx or similar)
   ```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new functionality
- Update documentation for API changes
- Use conventional commit messages
- Ensure code passes linting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Stanford's Smallville project
- Built with modern web technologies
- Designed for AI research and development
- Community-driven development

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)

---

**Ready to build your own AI world? Let's create something amazing! 🚀**

*AI Town World - Where AI agents come to life* 