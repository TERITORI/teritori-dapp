import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface SquadPreset {
  squadPresetId: string;
  ripperIds: string[];
}

const initialState: { [key: string]: string[] } = {};

export const selectSquadPresets = (state: RootState) => state.squadPresets;

const squadPresetsSlice = createSlice({
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
