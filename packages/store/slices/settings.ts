import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Settings {
  selectedNetworkId: string;
  selectedWalletId: string;
  isKeplrConnected: boolean;
  alreadyVisited: boolean;
  areTestnetsEnabled: boolean;
}

const initialState: Settings = {
  selectedWalletId: "",
  selectedNetworkId: "",
  isKeplrConnected: false,
  alreadyVisited: false,
  areTestnetsEnabled: false,
};

export const selectSelectedNetworkId = (state: RootState) =>
  state.settings.selectedNetworkId;

export const selectSelectedWalletId = (state: RootState) =>
  state.settings.selectedWalletId;

export const selectIsKeplrConnected = (state: RootState) =>
  state.settings.isKeplrConnected;

export const selectAreTestnetsEnabled = (state: RootState) =>
  state.settings.areTestnetsEnabled;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSelectedNetworkId: (state, action: PayloadAction<string>) => {
      state.selectedNetworkId = action.payload;
    },
    setSelectedWalletId: (state, action: PayloadAction<string>) => {
      state.selectedWalletId = action.payload;
    },
    setIsKeplrConnected: (state, action: PayloadAction<boolean>) => {
      state.isKeplrConnected = action.payload;
    },
    setAreTestnetsEnabled: (state, action: PayloadAction<boolean>) => {
      state.areTestnetsEnabled = action.payload;
    },
  },
});

export const {
  setSelectedNetworkId,
  setSelectedWalletId,
  setIsKeplrConnected,
  setAreTestnetsEnabled,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
