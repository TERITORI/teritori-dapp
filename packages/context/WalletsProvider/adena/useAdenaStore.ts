import { create } from "zustand";

export type AdenaState = { addresses: string[]; chainId?: string };

type AdenaStore = {
  state: AdenaState;
  setState: (state: AdenaState) => void;
};

export const useAdenaStore = create<AdenaStore>()((set) => ({
  state: { addresses: [] },
  setState: (state: AdenaState) => set({ state }),
}));
