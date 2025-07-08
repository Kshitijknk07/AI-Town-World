import type { Agent } from "../types/agent";

interface AgentTalkDropdownProps {
  agent: Agent;
  agents: Agent[];
  onTalk: (toId: string, content: string) => void;
}

export function AgentTalkDropdown({
  agent,
  agents,
  onTalk,
}: AgentTalkDropdownProps) {
  return (
    <select
      className="mt-4 w-full bg-gray-700 text-white p-2 rounded"
      onChange={(e) => {
        const targetId = e.target.value;
        if (!targetId) return;
        const content = prompt(
          `What should ${agent.name} say to ${
            agents.find((a) => a.id === targetId)?.name
          }?`
        );
        if (content) {
          onTalk(targetId, content);
        }
      }}
    >
      <option value="">💬 Talk to another agent...</option>
      {agents
        .filter((a) => a.id !== agent.id)
        .map((target) => (
          <option key={target.id} value={target.id}>
            {target.name}
          </option>
        ))}
    </select>
  );
}
