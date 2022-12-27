import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Settings {
  selectedWalletId: string;
  isKeplrConnected: boolean;
  isMetamaskConnected: boolean;
  alreadyVisited: boolean;
}

const initialState: Settings = {
  selectedWalletId: "",
  isKeplrConnected: false,
  isMetamaskConnected: false,
  alreadyVisited: false,
};

export const selectSelectedWalletId = (state: RootState) =>
  state.settings.selectedWalletId;

export const selectIsKeplrConnected = (state: RootState) =>
  state.settings.isKeplrConnected;

export const selectIsMetamaskConnected = (state: RootState) =>
  state.settings.isMetamaskConnected;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSelectedWalletId: (state, action: PayloadAction<string>) => {
      state.selectedWalletId = action.payload;
    },
    setIsKeplrConnected: (state, action: PayloadAction<boolean>) => {
      state.isKeplrConnected = action.payload;
    },
    setIsMetamaskConnected: (state, action: PayloadAction<boolean>) => {
      state.isMetamaskConnected = action.payload;
    },
  },
});

export const {
  setSelectedWalletId,
  setIsKeplrConnected,
  setIsMetamaskConnected,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
