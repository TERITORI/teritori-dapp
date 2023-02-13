import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { dAppGroup } from "../../screens/DAppStore/types";
import { RootState } from "../store";

type pinnedAppsCollection = string[];

interface DappsStorage {
  selectedApps: pinnedAppsCollection;
  availableApps: dAppGroup;
}

const initialState: DappsStorage = {
  selectedApps: [],
  availableApps: {},
};

export const selectAvailableApps = (state: RootState) =>
  state.dAppsStore.availableApps;

export const selectCheckedApps = (state: RootState) => [
  ...new Set(state.dAppsStore.selectedApps),
];

const dAppsStore = createSlice({
  name: "dapps-storage",
  initialState,
  reducers: {
    setAvailableApps: (state, action: PayloadAction<dAppGroup>) => {
      state.availableApps = action.payload;
    },
    setSelectedApps: (state, action: PayloadAction<pinnedAppsCollection>) => {
      state.selectedApps = action.payload;
    },
    setCheckedApp: (
      state,
      action: PayloadAction<{
        draggableId: string;
        isChecked: boolean;
      }>
    ) => {
      const newValues = Array.from(state.selectedApps);
      if (action.payload.isChecked) {
        newValues.push(action.payload.draggableId);
      } else {
        const index = state.selectedApps.findIndex(
          (element) => element === action.payload.draggableId
        );
        if (index !== -1) {
          newValues.splice(index, 1);
        }
      }
      state.selectedApps = newValues;
    },
  },
});

export const { setAvailableApps, setCheckedApp, setSelectedApps } =
  dAppsStore.actions;

export const dAppsReducer = dAppsStore.reducer;
