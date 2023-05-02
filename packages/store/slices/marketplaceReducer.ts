import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface MarketplaceStorageType {
  selectedNFT: string[];
  cartTotal: number;
}

const initialState: MarketplaceStorageType = {
  selectedNFT: [],
  cartTotal: 0,
};

export const selectSelectedNFT = (state: RootState) => [
  ...new Set(state.marketplace.selectedNFT),
];
export const selectCartTotal = (state: RootState) =>
  state.marketplace.cartTotal;

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
    addTotal: (state, action: PayloadAction<number>) => {
      state.cartTotal = state.cartTotal + action.payload;
    },
    deductFromTotal: (state, action: PayloadAction<number>) => {
      state.cartTotal = state.cartTotal - action.payload;
    },
  },
});

export const {
  setSelectedNFT,
  removeSelected,
  clearSelected,
  addTotal,
  deductFromTotal,
} = marketplace.actions;

export const marketplaceReducer = marketplace.reducer;
