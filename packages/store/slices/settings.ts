import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Settings {
  selectedWalletId: string;
}

const initialState: Settings = {
  selectedWalletId: "",
};

export const selectSelectedWalletId = (state: RootState) =>
  state.settings.selectedWalletId;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSelectedWalletId: (state, action: PayloadAction<string>) => {
      state.selectedWalletId = action.payload;
    },
  },
});

export const { setSelectedWalletId } = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
