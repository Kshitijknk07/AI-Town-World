# 🎨 AI Town Frontend

A modern, real-time React frontend for AI Town World - a beautiful and interactive interface for monitoring and interacting with AI agents in a virtual town simulation.

## 🌟 Overview

The AI Town Frontend is a sophisticated React application built with TypeScript that provides a rich, real-time interface for the AI agent simulation. It features smooth animations, responsive design, and comprehensive tools for monitoring and interacting with the virtual town and its inhabitants.

### 🎯 Key Features

- **🎨 Modern UI/UX**: Beautiful, responsive design with smooth animations
- **⚡ Real-time Updates**: Live WebSocket integration with the backend
- **🧠 Agent Interaction**: Chat with agents and view their thoughts
- **🗺️ Town Visualization**: Interactive map showing agent locations
- **📊 Event Monitoring**: Real-time event log and statistics
- **💾 Memory Explorer**: Browse agent memories and knowledge
- **🔧 Developer Tools**: Advanced debugging and monitoring tools
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎭 Smooth Animations**: Framer Motion for delightful interactions

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── Header.tsx       # Application header
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── TownMap.tsx      # Town visualization
│   │   ├── AgentCard.tsx    # Individual agent display
│   │   ├── AgentInfo.tsx    # Detailed agent information
│   │   ├── ChatWindow.tsx   # Agent communication
│   │   ├── EventLog.tsx     # Event monitoring
│   │   ├── MemoryViewer.tsx # Memory exploration
│   │   ├── DevTools.tsx     # Development tools
│   │   ├── TimeControls.tsx # Simulation controls
│   │   └── BottomPanel.tsx  # Bottom panel
│   ├── store/               # State management
│   │   └── simulationStore.ts # Zustand store
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Type definitions
│   ├── utils/               # Utility functions
│   │   └── index.ts         # Helper functions
│   ├── hooks/               # Custom React hooks
│   │   └── useWebSocket.ts  # WebSocket hook
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## 🛠️ Technology Stack

### Core Technologies
- **Framework**: React 18.2+
- **Language**: TypeScript 5.2+
- **Build Tool**: Vite 5.0+
- **Styling**: Tailwind CSS 3.3+
- **State Management**: Zustand 4.4+
- **Real-time**: Socket.io Client 4.7+

### UI/UX Libraries
- **Animations**: Framer Motion 10.18+
- **Icons**: Lucide React 0.294+
- **Utilities**: clsx, tailwind-merge
- **Development**: ESLint, TypeScript ESLint

### Key Dependencies
- **React**: Core framework with hooks
- **TypeScript**: Type safety and development experience
- **Vite**: Fast development and building
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Framer Motion**: Animation library
- **Socket.io Client**: Real-time communication

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **pnpm** (recommended) or npm
- **Backend server** running on localhost:3001
- **Git** for version control

### Installation

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

4. **Access the Application**
   - Open http://localhost:5173 in your browser
   - Ensure the backend is running on http://localhost:3001

### Build for Production

```bash
# Build the application
pnpm build

# Preview the build
pnpm preview
```

## 🎨 Component Architecture

### Core Components

#### `App.tsx` - Main Application
The root component that orchestrates the entire application layout and state management.

```typescript
function App() {
  const { isRunning, selectedAgentId, agents, ui, advanceTime } = useSimulationStore();

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      advanceTime(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, advanceTime]);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <TownMap />
            {selectedAgent && <AgentCard agent={selectedAgent} />}
          </div>
          <TimeControls />
        </div>
      </div>
      <BottomPanel />
      {ui.showMemoryViewer && <MemoryViewer />}
      {ui.showDevTools && <DevTools />}
    </div>
  );
}
```

#### `Header.tsx` - Application Header
Contains the main navigation, simulation controls, and application title.

**Features:**
- Simulation start/stop controls
- Application title and branding
- User settings and preferences
- Connection status indicator

#### `Sidebar.tsx` - Navigation Sidebar
Provides navigation between different views and agent selection.

**Features:**
- Agent list with avatars and status
- Quick navigation to different panels
- Agent search and filtering
- Collapsible design for space efficiency

#### `TownMap.tsx` - Town Visualization
Interactive map showing the virtual town and agent locations.

**Features:**
- Visual representation of town buildings
- Real-time agent location updates
- Click-to-select agent functionality
- Building information on hover
- Responsive design for different screen sizes

#### `AgentCard.tsx` - Agent Information Card
Compact display of selected agent information.

**Features:**
- Agent avatar and basic info
- Current location and goal
- Energy and mood indicators
- Quick action buttons
- Smooth animations on state changes

#### `AgentInfo.tsx` - Detailed Agent View
Comprehensive agent information and interaction panel.

**Features:**
- Detailed personality information
- Relationship network
- Memory timeline
- Goal tracking
- Interaction history

#### `ChatWindow.tsx` - Agent Communication
Interface for chatting with AI agents.

**Features:**
- Real-time chat with agents
- Message history
- Typing indicators
- Message timestamps
- Conversation context

#### `EventLog.tsx` - Event Monitoring
Real-time log of simulation events and activities.

**Features:**
- Live event streaming
- Event filtering by type
- Search functionality
- Export capabilities
- Performance metrics

#### `MemoryViewer.tsx` - Memory Exploration
Advanced tool for browsing agent memories and knowledge.

**Features:**
- Memory search and filtering
- Memory categorization
- Timeline view
- Memory strength indicators
- Export and analysis tools

#### `DevTools.tsx` - Development Tools
Advanced debugging and monitoring tools for developers.

**Features:**
- Performance monitoring
- State inspection
- Network debugging
- Error tracking
- Simulation controls

#### `TimeControls.tsx` - Simulation Controls
Controls for managing simulation time and speed.

**Features:**
- Play/pause/stop controls
- Speed adjustment
- Time display
- Date navigation
- Simulation statistics

#### `BottomPanel.tsx` - Bottom Panel
Additional information and controls at the bottom of the screen.

**Features:**
- Quick stats display
- Notification area
- Status indicators
- Collapsible design

## 🔄 State Management

### Zustand Store Structure

The application uses Zustand for state management with a single store containing all simulation state:

```typescript
interface SimulationState {
  // Simulation Control
  isRunning: boolean;
  simulationSpeed: 'slow' | 'normal' | 'fast' | 'ultra';
  currentTime: Date;
  
  // Agents
  agents: Agent[];
  selectedAgentId: string | null;
  
  // UI State
  ui: {
    showMemoryViewer: boolean;
    showDevTools: boolean;
    showChat: boolean;
    sidebarCollapsed: boolean;
  };
  
  // Events and Data
  events: Event[];
  memories: Memory[];
  relationships: Relationship[];
  
  // Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  setSpeed: (speed: SimulationSpeed) => void;
  selectAgent: (agentId: string) => void;
  advanceTime: (minutes: number) => void;
  addEvent: (event: Event) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
}
```

### Store Usage Example

```typescript
import { useSimulationStore } from './store/simulationStore';

function MyComponent() {
  const { 
    agents, 
    selectedAgentId, 
    isRunning, 
    startSimulation, 
    selectAgent 
  } = useSimulationStore();

  const selectedAgent = agents.find(agent => agent.id === selectedAgentId);

  return (
    <div>
      <button onClick={startSimulation} disabled={isRunning}>
        Start Simulation
      </button>
      {selectedAgent && <AgentCard agent={selectedAgent} />}
    </div>
  );
}
```

## 🔌 Real-time Communication

### WebSocket Integration

The frontend connects to the backend via WebSocket for real-time updates:

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSimulationStore } from '../store/simulationStore';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { 
    updateAgent, 
    addEvent, 
    addMemory, 
    updateTime,
    updateSimulationStatus 
  } = useSimulationStore();

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('agent:update', updateAgent);
    socketRef.current.on('event:new', addEvent);
    socketRef.current.on('memory:new', addMemory);
    socketRef.current.on('world:time', updateTime);
    socketRef.current.on('simulation:status', updateSimulationStatus);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
}
```

### Event Handling

```typescript
// Example of handling real-time events
socket.on('agent:thought', (data) => {
  console.log(`${data.agentName} thinks: ${data.thought}`);
  // Update UI to show the thought
});

socket.on('agent:movement', (data) => {
  console.log(`${data.agentName} moved from ${data.from} to ${data.to}`);
  // Update agent position on map
});

socket.on('chat:message', (data) => {
  console.log(`Chat: ${data.from} -> ${data.to}: ${data.message}`);
  // Add message to chat window
});
```

## 🎨 Styling and Design

### Tailwind CSS Configuration

The application uses a custom Tailwind configuration with a comprehensive design system:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
```

### CSS Variables

```css
/* index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
  --chart-4: 43 74% 66%;
  --chart-5: 27 87% 67%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

## 🎭 Animations

### Framer Motion Integration

The application uses Framer Motion for smooth, performant animations:

```typescript
import { motion, AnimatePresence } from 'framer-motion';

// Example: Animated agent card
function AgentCard({ agent }: { agent: Agent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-lg shadow-lg p-4"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-3"
      >
        <span className="text-2xl">{agent.avatar}</span>
        <div>
          <h3 className="font-semibold">{agent.name}</h3>
          <p className="text-sm text-gray-600">{agent.current_location}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Example: Animated list
function AgentList({ agents }: { agents: Agent[] }) {
  return (
    <AnimatePresence>
      {agents.map((agent, index) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ delay: index * 0.1 }}
        >
          <AgentCard agent={agent} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

## 🔧 Development

### Project Structure Deep Dive

#### Component Organization

Components are organized by functionality and complexity:

- **Layout Components**: Header, Sidebar, BottomPanel
- **Feature Components**: TownMap, AgentCard, ChatWindow
- **Utility Components**: TimeControls, EventLog
- **Tool Components**: MemoryViewer, DevTools

#### TypeScript Integration

Strong typing throughout the application:

```typescript
// types/index.ts
export interface Agent {
  id: string;
  name: string;
  avatar: string;
  personality: Personality;
  current_location: string;
  current_goal: string;
  energy: number;
  mood: string;
  relationships: Relationship[];
  memories: Memory[];
}

export interface Personality {
  traits: string[];
  background: string;
  interests: string[];
  communication_style: string;
  goals: string[];
}

export interface Event {
  id: string;
  type: 'conversation' | 'movement' | 'thought' | 'action';
  agent_id: string;
  target_agent_id?: string;
  location: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Memory {
  id: string;
  agent_id: string;
  content: string;
  type: 'conversation' | 'observation' | 'experience';
  importance: number;
  timestamp: Date;
  related_memories?: string[];
}
```

### Adding New Features

#### 1. New Component

```typescript
// components/NewFeature.tsx
import { motion } from 'framer-motion';
import { useSimulationStore } from '../store/simulationStore';

interface NewFeatureProps {
  // Define props
}

export function NewFeature({ ...props }: NewFeatureProps) {
  const { /* relevant state */ } = useSimulationStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-4"
    >
      {/* Component content */}
    </motion.div>
  );
}
```

#### 2. New Store Action

```typescript
// store/simulationStore.ts
interface SimulationState {
  // ... existing state
  newFeature: NewFeatureData;
  
  // ... existing actions
  updateNewFeature: (data: NewFeatureData) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  // ... existing state and actions
  
  newFeature: initialNewFeatureData,
  
  updateNewFeature: (data) => set((state) => ({
    ...state,
    newFeature: { ...state.newFeature, ...data }
  })),
}));
```

#### 3. New WebSocket Event

```typescript
// hooks/useWebSocket.ts
useEffect(() => {
  socketRef.current = io('http://localhost:3001');

  // ... existing event listeners
  
  socketRef.current.on('new:event', (data) => {
    // Handle new event
    updateNewFeature(data);
  });

  return () => {
    socketRef.current?.disconnect();
  };
}, []);
```

### Testing

#### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

#### Component Testing Example

```typescript
// components/__tests__/AgentCard.test.tsx
import { render, screen } from '@testing-library/react';
import { AgentCard } from '../AgentCard';

const mockAgent = {
  id: '1',
  name: 'Test Agent',
  avatar: '🧪',
  current_location: 'Test Location',
  current_goal: 'Test Goal',
  energy: 100,
  mood: 'happy',
  personality: {
    traits: ['test'],
    background: 'Test background',
    interests: ['testing'],
    communication_style: 'direct',
    goals: ['test goal']
  },
  relationships: [],
  memories: []
};

describe('AgentCard', () => {
  it('renders agent information correctly', () => {
    render(<AgentCard agent={mockAgent} />);
    
    expect(screen.getByText('Test Agent')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('🧪')).toBeInTheDocument();
  });
});
```

### Code Quality

#### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

#### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 📱 Responsive Design

### Breakpoint Strategy

The application uses a mobile-first approach with Tailwind's responsive utilities:

```typescript
// Example responsive component
function ResponsiveComponent() {
  return (
    <div className="
      w-full 
      md:w-1/2 
      lg:w-1/3 
      xl:w-1/4
      p-2 
      md:p-4 
      lg:p-6
    ">
      <div className="
        text-sm 
        md:text-base 
        lg:text-lg
        font-medium
      ">
        Content
      </div>
    </div>
  );
}
```

### Mobile Considerations

- Touch-friendly interface elements
- Swipe gestures for navigation
- Optimized layouts for small screens
- Reduced animations on mobile devices

## 🚀 Performance Optimization

### React Optimization

#### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoized component
const AgentCard = memo(({ agent }: { agent: Agent }) => {
  // Component implementation
});

// Memoized calculations
function AgentList({ agents }: { agents: Agent[] }) {
  const sortedAgents = useMemo(() => 
    agents.sort((a, b) => a.name.localeCompare(b.name)), 
    [agents]
  );

  const handleAgentSelect = useCallback((agentId: string) => {
    // Handle selection
  }, []);

  return (
    <div>
      {sortedAgents.map(agent => (
        <AgentCard 
          key={agent.id} 
          agent={agent} 
          onSelect={handleAgentSelect}
        />
      ))}
    </div>
  );
}
```

#### Code Splitting

```typescript
// Lazy load heavy components
const MemoryViewer = lazy(() => import('./components/MemoryViewer'));
const DevTools = lazy(() => import('./components/DevTools'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {ui.showMemoryViewer && <MemoryViewer />}
      {ui.showDevTools && <DevTools />}
    </Suspense>
  );
}
```

### Bundle Optimization

#### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
});
```

## 🔍 Debugging and Monitoring

### Development Tools

#### React DevTools
- Component tree inspection
- Props and state debugging
- Performance profiling
- Hook debugging

#### Browser DevTools
- Network monitoring for WebSocket connections
- Performance profiling
- Memory usage analysis
- Console logging

#### Custom DevTools Component

The application includes a custom DevTools component for:
- State inspection
- Performance monitoring
- Network debugging
- Error tracking

### Error Handling

```typescript
// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}
```

## 🚀 Deployment

### Build Process

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Preview build
pnpm preview
```

### Environment Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  define: {
    __BACKEND_URL__: JSON.stringify(process.env.VITE_BACKEND_URL || 'http://localhost:3001'),
  },
});
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

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

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Conventional Commits**: Use conventional commit messages
- **Testing**: Add tests for new components and features
- **Documentation**: Document new components and APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React best practices
- Inspired by beautiful UI/UX design patterns
- Designed for optimal user experience
- Community-driven development

---

**Ready to create amazing user experiences? Let's build something beautiful! 🎨**

*AI Town Frontend - Where beautiful interfaces meet intelligent agents* 