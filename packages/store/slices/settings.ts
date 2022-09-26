import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Settings {
  selectedWalletId: string;
  isKeplrConnected: boolean;
  alreadyVisited: boolean;
}

const initialState: Settings = {
  selectedWalletId: "",
  isKeplrConnected: false,
  alreadyVisited: false,
};

export const selectSelectedWalletId = (state: RootState) =>
  state.settings.selectedWalletId;

export const selectIsKeplrConnected = (state: RootState) =>
  state.settings.isKeplrConnected;

export const selectAlreadyVisited = (state: RootState) =>
  state.settings.alreadyVisited;

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
    setAlreadyVisited: (state, action: PayloadAction<boolean>) => {
      state.alreadyVisited = action.payload;
    },
  },
});

export const { setSelectedWalletId, setIsKeplrConnected, setAlreadyVisited } =
  settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
