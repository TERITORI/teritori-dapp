import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

export interface SquadPreset {
  squadPresetId: string;
  ripperIds: string[];
}

const initialState: { [key: string]: string[] } = {};

export const selectSquadPresets = (state: RootState) => state.squadPresets;

export const squadPresetsSlice = createSlice({
  name: "squadPresets",
  initialState,
  reducers: {
    persistSquadPreset: (state, action: PayloadAction<SquadPreset>) => {
      const { squadPresetId, ripperIds } = action.payload;
      state[squadPresetId] = ripperIds;
    },
  },
});

export const { persistSquadPreset } = squadPresetsSlice.actions;

export const squadPresetsReducer = squadPresetsSlice.reducer;
