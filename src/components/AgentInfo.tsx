import React from "react";
import { Heart, Target, Brain, Users } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";
import { getMoodEmoji, getEnergyColor, getRelationshipLabel } from "../utils";

const AgentInfo: React.FC = () => {
  const { selectedAgentId, agents } = useSimulationStore();
  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);

  if (!selectedAgent) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <div className="text-sm">Select an agent to view details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {}
      <div className="flex items-center space-x-4 p-4 bg-soft-gray rounded-xl">
        <div className="agent-avatar text-2xl">{selectedAgent.avatar}</div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-text-primary">
            {selectedAgent.name}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <span>{getMoodEmoji(selectedAgent.mood)}</span>
            <span>•</span>
            <span className={getEnergyColor(selectedAgent.energy)}>
              Energy: {selectedAgent.energy}%
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span>Current Status</span>
        </h3>

        <div className="space-y-2">
          <div className="p-3 bg-white rounded-lg border border-border-light">
            <div className="text-xs text-text-secondary mb-1">Current Goal</div>
            <div className="text-sm text-text-primary">
              {selectedAgent.currentGoal}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-border-light">
            <div className="text-xs text-text-secondary mb-1">
              Current Thought
            </div>
            <div className="text-sm text-text-primary">
              {selectedAgent.currentThought}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-border-light">
            <div className="text-xs text-text-secondary mb-1">Location</div>
            <div className="text-sm text-text-primary">
              {selectedAgent.currentLocation}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary flex items-center space-x-2">
          <Brain className="w-4 h-4" />
          <span>Personality</span>
        </h3>

        <div className="space-y-2">
          <div className="p-3 bg-white rounded-lg border border-border-light">
            <div className="text-xs text-text-secondary mb-2">Traits</div>
            <div className="flex flex-wrap gap-1">
              {selectedAgent.personality.traits.map((trait, index) => (
                <span
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-border-light">
            <div className="text-xs text-text-secondary mb-2">Goals</div>
            <div className="space-y-1">
              {selectedAgent.personality.goals.map((goal, index) => (
                <div key={index} className="text-sm text-text-primary">
                  • {goal}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-border-light">
            <div className="text-xs text-text-secondary mb-2">Interests</div>
            <div className="flex flex-wrap gap-1">
              {selectedAgent.personality.interests.map((interest, index) => (
                <span
                  key={index}
                  className="text-xs bg-lavender-accent text-primary px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary flex items-center space-x-2">
          <Heart className="w-4 h-4" />
          <span>Relationships</span>
        </h3>

        <div className="space-y-2">
          {Object.entries(selectedAgent.relationships).map(
            ([agentId, score]) => {
              const otherAgent = agents.find((a) => a.id === agentId);
              if (!otherAgent) return null;

              return (
                <div
                  key={agentId}
                  className="p-3 bg-white rounded-lg border border-border-light"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="agent-avatar text-sm">
                        {otherAgent.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {otherAgent.name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {getRelationshipLabel(score)}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        score >= 0.5
                          ? "text-green-600"
                          : score >= 0
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {score >= 0 ? "+" : ""}
                      {Math.round(score * 100)}%
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Daily Schedule
        </h3>
        <div className="space-y-2">
          {selectedAgent.schedule.activities.map((activity, index) => (
            <div
              key={index}
              className="p-3 bg-white rounded-lg border border-border-light"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {activity.activity}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {activity.location}
                  </div>
                </div>
                <div className="text-xs text-text-secondary">
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentInfo;
