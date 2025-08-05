import { create } from "zustand";

export type RunnerConfig = {
  app_name: string;
  user_id: string;
  session_id: string;
};

export type RunnerConfigStore = {
  runnerConfig: RunnerConfig;
  setRunnerConfig: (data: RunnerConfig) => void;
};

export const useRunnerConfigStore = create<RunnerConfigStore>((set) => ({
  runnerConfig: {
    app_name: "",
    user_id: "",
    session_id: "",
  },

  setRunnerConfig: (data) =>
    set((state) => ({
      runnerConfig: { ...state.runnerConfig, ...data },
    })),
}));
