import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface MarketplaceStorageType {
  selectedNFT: string[];
}

const initialState: MarketplaceStorageType = {
  selectedNFT: [],
};

export const selectSelectedNFT = (state: RootState) => [
  ...new Set(state.marketplace.selectedNFT),
];

// state.marketplace.selectedNFT;

const marketplace = createSlice({
  name: "marketPlace",
  initialState,
  reducers: {
    setSelectedNFT: (state, action: PayloadAction<string>) => {
      let newState: Set<string>;
      if (state.selectedNFT === undefined) {
        newState = new Set();
      } else {
        newState = new Set(state.selectedNFT);
      }

      if (newState.has(action.payload)) {
        newState.delete(action.payload);
      } else {
        newState.add(action.payload);
      }
      state.selectedNFT = Array.from(newState);
    },
    removeSelected: (state, action: PayloadAction<string>) => {
      let newState: Set<string>;
      if (state.selectedNFT === undefined) {
        newState = new Set();
      } else {
        newState = new Set(state.selectedNFT);
      }
      newState.delete(action.payload);
      state.selectedNFT = Array.from(newState);
    },
    clearSelected: (state) => {
      state.selectedNFT = [];
    },
  },
});

export const { setSelectedNFT, removeSelected, clearSelected } =
  marketplace.actions;

export const marketplaceReducer = marketplace.reducer;
