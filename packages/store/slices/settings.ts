import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Settings {
  selectedWalletId: string;
  selectedNetworkId: string;
  isKeplrConnected: boolean;
  alreadyVisited: boolean;
}

const initialState: Settings = {
  selectedWalletId: "",
  selectedNetworkId: process.env.TERITORI_NETWORK_ID || "",
  isKeplrConnected: false,
  alreadyVisited: false,
};

export const selectSelectedWalletId = (state: RootState) =>
  state.settings.selectedWalletId;

export const selectSelectedNetworkId = (state: RootState) =>
  state.settings.selectedNetworkId;

export const selectIsKeplrConnected = (state: RootState) =>
  state.settings.isKeplrConnected;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSelectedWalletId: (state, action: PayloadAction<string>) => {
      state.selectedWalletId = action.payload;
    },
    setSelectedNetworkId: (state, action: PayloadAction<string>) => {
      state.selectedNetworkId = action.payload;
    },
    setIsKeplrConnected: (state, action: PayloadAction<boolean>) => {
      state.isKeplrConnected = action.payload;
    },
  },
});

export const {
  setSelectedWalletId,
  setSelectedNetworkId,
  setIsKeplrConnected,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
