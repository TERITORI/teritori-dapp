import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { dAppGroup, dAppType } from "../../screens/DAppStore/types";
import { RootState } from "../store";

interface pinnedAppsCollection {
  [key: string]: dAppType;
}

interface DappsStorage {
  pinnedApps: pinnedAppsCollection;
  availableApps: dAppGroup;
}

const initialState: DappsStorage = {
  pinnedApps: {},
  availableApps: {},
};

export const selectPinnedApps = (state: RootState) =>
  state.dAppsStore.pinnedApps;

export const selectAvailableApps = (state: RootState) =>
  state.dAppsStore.availableApps;

const dAppsStore = createSlice({
  name: "dapps-storage",
  initialState,
  reducers: {
    setPinnedApp: (state, action: PayloadAction<pinnedAppsCollection>) => {
      state.pinnedApps = action.payload;
    },
    setAvailableApps: (state, action: PayloadAction<dAppGroup>) => {
      state.availableApps = action.payload;
    },
    setCheckedApp: (
      state,
      action: PayloadAction<{
        groupKey: string;
        appId: string;
        isChecked: boolean;
      }>
    ) => {
      state.availableApps[action.payload.groupKey]["options"][
        action.payload.appId
      ].isChecked = action.payload.isChecked;
    },
    removePinnedApp: (
      state,
      action: PayloadAction<{
        appId: string;
      }>
    ) => {
      delete state.pinnedApps[action.payload.appId];
    },
  },
});

export const {
  setPinnedApp,
  setAvailableApps,
  setCheckedApp,
  removePinnedApp,
} = dAppsStore.actions;

export const dAppsReducer = dAppsStore.reducer;
