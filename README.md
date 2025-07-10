# 🏘️ AI Town World

A self-contained virtual town where AI agents live, interact, form memories, and evolve over time - all running locally without external APIs.

## 🧠 What is AI Town?

AI Town is a miniature "Westworld" or "The Sims" for AI research - a fully offline simulation where intelligent agents:

- **Live** with realistic daily routines
- **Interact** with each other naturally
- **Form memories** and relationships
- **Evolve** over time through experiences
- **Run completely locally** - no cloud dependencies

## 🎯 Project Goals

- **Simulate Human-like AI Behavior**: Create agents with memory, personality, and daily routines
- **Test AI Interactions Safely**: Local sandbox for studying multi-agent behavior
- **Offline, Self-contained World**: No internet, APIs, or cloud models required
- **Encourage Emergent Behavior**: Let agents develop unique behaviors organically
- **Research & Development Tool**: Perfect for AI safety testing, game dev, and behavioral studies

## 🧪 Core Capabilities

- 🧍 **AI Agents**: Memory, goals, emotions, personality
- 🏠 **Virtual Town**: Homes, shops, public spaces
- 🕒 **Time Progression**: Hour/day cycles with realistic scheduling
- 🧠 **Local LLM**: Reasoning via llama.cpp or ollama
- 📜 **Memory Persistence**: Agents remember past interactions
- 🔁 **Emergent Behaviors**: Gossip, friendships, rivalries, social dynamics

## 🏗️ Architecture

```
ai-town-world/
├── src/
│   ├── agents/          # AI agent logic and personalities
│   ├── world/           # Town layout and environment
│   ├── memory/          # Memory and persistence systems
│   ├── llm/            # Local LLM integration
│   ├── simulation/     # Time progression and scheduling
│   └── ui/             # Visualization and monitoring
├── data/
│   ├── town_layout/    # Town maps and building data
│   ├── agent_profiles/ # Agent personalities and histories
│   └── memories/       # Persistent memory storage
├── config/             # Configuration files
├── tests/              # Test suite
└── docs/               # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Local LLM (Ollama or llama.cpp)
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd AI-Town-World

# Install dependencies
pip install -r requirements.txt

# Set up local LLM (using Ollama as example)
ollama pull llama3.2:3b

# Run the simulation
python src/main.py
```

### Configuration

1. Copy `config/config.example.yaml` to `config/config.yaml`
2. Update LLM settings and town parameters
3. Customize agent personalities and town layout

## 🎮 Usage

### Basic Simulation

```python
from src.simulation import Simulation
from src.world import Town

# Create a new town
town = Town("Smallville")

# Start simulation
sim = Simulation(town)
sim.run(days=30)
```

### Adding Custom Agents

```python
from src.agents import Agent, Personality

# Create a new agent
alice = Agent(
    name="Alice",
    personality=Personality(
        traits=["curious", "friendly", "artistic"],
        goals=["make friends", "paint landscapes"]
    )
)

town.add_agent(alice)
```

## 🔬 Research Use Cases

- **AI Safety Testing**: Observe agent behavior in controlled environments
- **Multi-Agent Systems**: Study emergent social dynamics
- **Memory Systems**: Test long-term memory and learning
- **Behavioral Economics**: Simulate social interactions and decision-making
- **Game Development**: Prototype NPC behavior systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by Stanford's Smallville project
- Built for the AI research community
- Designed for local, privacy-focused AI experimentation

---

**Ready to build your own AI world? Let's create something amazing! 🚀** 