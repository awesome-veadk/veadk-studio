import { create } from "zustand";

export type Agent = {
  name: string;
  description: string;
  instruction: string;
  model_name: string;
  short_term_memory_backend: string;
  short_term_memory_db_url: string;
  long_term_memory_backend: string;
  knowledgebase_backend: string;
};

type AgentStore = {
  agent: Agent;
  setAgent: (data: Partial<Agent>) => void;
};

export const useAgentStore = create<AgentStore>((set) => ({
  agent: {
    name: "",
    description: "",
    instruction: "",
    model_name: "",
    short_term_memory_backend: "",
    short_term_memory_db_url: "",
    long_term_memory_backend: "",
    knowledgebase_backend: "",
  },

  setAgent: (data) =>
    set((state) => ({
      agent: { ...state.agent, ...data },
    })),
}));
