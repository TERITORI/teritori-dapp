import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { dAppGroup } from "../../screens/DAppStore/types";
import { RootState } from "../store";

type pinnedAppsCollection = string[];

interface DappsStorage {
  availableApps: dAppGroup;
}

interface DappsStoragePersisted {
  selectedApps: pinnedAppsCollection;
}

const initialState: DappsStorage = {
  availableApps: {},
};

const initialStatePersisted: DappsStoragePersisted = {
  selectedApps: [],
};

export const selectAvailableApps = (state: RootState) =>
  state.dAppsStore.availableApps;

export const selectCheckedApps = (state: RootState) =>
  state.dAppsStorePersisted.selectedApps;

const dAppsStore = createSlice({
  name: "dapps-storage",
  initialState,
  reducers: {
    setAvailableApps: (state, action: PayloadAction<dAppGroup>) => {
      state.availableApps = action.payload;
    },
  },
});
const dAppsStorePersisted = createSlice({
  name: "dapps-storage-persisted",
  initialState: initialStatePersisted,
  reducers: {
    setSelectedApps: (state, action: PayloadAction<pinnedAppsCollection>) => {
      state.selectedApps = action.payload;
    },
    setCheckedApp: (
      state,
      action: PayloadAction<{
        draggableId: string;
        isChecked: boolean;
      }>,
    ) => {
      const newValues = Array.from(state.selectedApps);
      if (action.payload.isChecked) {
        newValues.push(action.payload.draggableId);
      } else {
        const index = state.selectedApps.findIndex(
          (element) => element === action.payload.draggableId,
        );
        if (index !== -1) {
          newValues.splice(index, 1);
        }
      }
      state.selectedApps = newValues;
    },
  },
});
export const { setAvailableApps } = dAppsStore.actions;

export const { setSelectedApps, setCheckedApp } = dAppsStorePersisted.actions;

export const dAppsReducerPersisted = dAppsStorePersisted.reducer;
export const dAppsReducer = dAppsStore.reducer;
