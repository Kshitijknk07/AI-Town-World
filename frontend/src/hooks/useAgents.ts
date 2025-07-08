import { useEffect, useState } from "react";
import type { Agent } from "../types/agent";

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3500/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch agents");
        setLoading(false);
      });
  }, []);

  return { agents, loading, error };
}
