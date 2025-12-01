import { create } from "zustand";
import { Agent } from "@/components/features/map/types";
import { MOCK_AGENTS } from "@/components/features/map/utils/mock-data";

interface UIState {
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
  agents: Agent[];
}

export const useUIStore = create<UIState>((set) => ({
  selectedAgentId: null,
  setSelectedAgentId: (id: string | null) => set({ selectedAgentId: id }),
  agents: MOCK_AGENTS,
}));
