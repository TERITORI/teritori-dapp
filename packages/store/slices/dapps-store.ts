import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { dAppGroup, dAppType } from "../../screens/DAppStore/types";
import { RootState } from "../store";

interface pinnedAppsCollection {
  [key: string]: dAppType;
}

interface DappsStorage {
  selectedApps: pinnedAppsCollection;
  availableApps: dAppGroup;
}

const initialState: DappsStorage = {
  selectedApps: {},
  availableApps: {},
};

export const selectAvailableApps = (state: RootState) =>
  state.dAppsStore.availableApps;

export const getSelectedApps = (state: RootState) =>
  Object.values(state.dAppsStore.availableApps).flatMap((element) =>
    Object.values(element.options).filter(
      (option: dAppType) => option.isChecked
    )
  );

const persist = (state: dAppGroup) => {
  const pureMagic = JSON.stringify(state, function replacer(key, value) {
    if (Array.isArray(value) && value.length === 0) {
      return { ...value }; // Converts empty array with string properties into a POJO
    }
    return value;
  });
  window.localStorage.setItem("teritori-dappstore", pureMagic);
};

const dAppsStore = createSlice({
  name: "dapps-storage",
  initialState,
  reducers: {
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
      persist(state.availableApps);
    },
    setOrder: (
      state,
      action: PayloadAction<{
        groupKey: string;
        appId: string;
        order: number;
      }>
    ) => {
      state.availableApps[action.payload.groupKey]["options"][
        action.payload.appId
      ].order = action.payload.order;
      persist(state.availableApps);
    },
  },
});

export const { setAvailableApps, setCheckedApp, setOrder } = dAppsStore.actions;

export const dAppsReducer = dAppsStore.reducer;
