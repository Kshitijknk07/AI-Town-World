# AI-Town-World 🌍

A dynamic AI-powered virtual town simulation where intelligent agents live, interact, and navigate through different zones. Watch as AI agents move around the town, form memories, and engage in conversations in real-time.

![AI Town World](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Express](https://img.shields.io/badge/Backend-Express-green)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)

## ✨ Features

- **🏘️ Interactive World Map**: Navigate through different zones including Bookstore, Town Hall, Park, Café, Library, Market, and Residential areas
- **🤖 AI Agents**: Intelligent agents that move around the town and interact with each other
- **🧠 Memory System**: Agents form and store memories of their experiences and interactions
- **💬 Conversation System**: Real-time conversations between agents
- **🎯 Agent Selection**: Click on agents to view their details and memories
- **🚀 Smooth Animations**: Beautiful animated transitions and dynamic updates
- **📱 Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** components for consistent UI
- **React Query** for state management
- **React Router** for navigation
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **RESTful API** architecture
- **CORS** enabled for cross-origin requests
- **Modular routing** system

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AI-Town-World.git
   cd AI-Town-World
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   pnpm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   pnpm start
   ```
   The backend will run on `http://localhost:3500`

2. **Start the frontend development server**
   ```bash
   cd frontend
   pnpm dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 🎮 How to Use

### Exploring the Town
- **View the World Map**: The main interface shows all zones and agents
- **Select an Agent**: Click on any agent to view their details
- **Move Agents**: Use the move functionality to relocate agents between zones
- **View Memories**: Access agent memories through the memory panel

### Available Zones
- **Bookstore** 📚 - Cozy reading space
- **Town Hall** 🏛️ - Administrative center
- **Central Park** 🌳 - Green space for relaxation
- **Town Café** ☕ - Popular meeting spot
- **Library** 📖 - Quiet study space
- **Market Square** 🛒 - Bustling marketplace
- **Residential Areas** 🏠 - Quiet neighborhoods
- **Elementary School** 🎓 - Local educational facility

## 🛠️ Development

### Frontend Scripts
```bash
cd frontend
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm build:dev    # Build for development
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
```

### Backend Scripts
```bash
cd backend
pnpm start        # Start the server
pnpm test         # Run tests
```

### Project Structure
```
AI-Town-World/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── world/       # World map and zone components
│   │   │   ├── agent/       # Agent-related components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Express.js backend server
│   ├── routes/              # API route handlers
│   ├── agents/              # Agent logic
│   ├── constants/           # Application constants
│   └── server.js            # Main server file
└── README.md
```

## 🔧 API Endpoints

### Zones
- `GET /api/zones` - Get all available zones

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents/:id/move` - Move agent to a zone

### Memory
- `GET /api/memory/:agentId` - Get agent memories

### Conversations
- `GET /api/conversation` - Get conversations
- `POST /api/conversation` - Create new conversation

## 🎨 UI Components

The project uses a comprehensive set of UI components from shadcn/ui:
- **Navigation**: Menus, dropdowns, breadcrumbs
- **Forms**: Inputs, selects, checkboxes, toggles
- **Feedback**: Toasts, alerts, progress bars
- **Layout**: Cards, sheets, modals, tooltips
- **Data Display**: Tables, lists, badges

## 🚀 Performance Optimizations

- **Vite** for fast development and optimized builds
- **React Query** for efficient data fetching and caching
- **Tailwind CSS** for optimized CSS
- **Code splitting** and lazy loading
- **Optimized animations** with Framer Motion

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Animations with [Framer Motion](https://www.framer.com/motion/)

---

**Happy exploring in AI-Town-World! 🌍✨** 