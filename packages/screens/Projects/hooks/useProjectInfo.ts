import { create } from "zustand";

type ProjectInfoState = {
  escrowToken: string;
  actions: {
    setEscrowToken: (escrowToken: string) => void;
  };
};

export const useProjectInfo = create<ProjectInfoState>((set, get) => ({
  escrowToken: "",
  actions: {
    setEscrowToken: (escrowToken: string) => set({ escrowToken }),
  },
}));
