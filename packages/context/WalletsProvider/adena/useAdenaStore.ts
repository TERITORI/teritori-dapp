import { create } from "zustand";

type AdenaState = { addresses: string[]; chainId?: string };

type AdenaStore = {
  state: AdenaState;
  setState: (state: Partial<AdenaState>) => void;
};

export const useAdenaStore = create<AdenaStore>()((set, get) => ({
  state: { addresses: [] },
  setState: (changes: Partial<AdenaState>) =>
    set({ state: { ...get().state, ...changes } }),
}));
