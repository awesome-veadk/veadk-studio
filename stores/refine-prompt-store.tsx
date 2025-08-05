import { create } from "zustand";

export type RefinePromptStore = {
  feedback: string;
  refineButtonRef: React.RefObject<HTMLButtonElement> | null;

  setFeedback: (feedback: string) => void;
  setRefineButtonRef: (ref: React.RefObject<HTMLButtonElement>) => void;
};

export const useRefinePromptStore = create<RefinePromptStore>((set) => ({
  feedback: "",
  refineButtonRef: null,
  setFeedback: (feedback) => set({ feedback }),
  setRefineButtonRef: (ref) => set({ refineButtonRef: ref }),
}));
