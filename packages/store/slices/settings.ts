import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Settings {
  selectedNetworkId: string;
  selectedWalletId: string | undefined;
  NFTStorageAPI: string;
  isKeplrConnected: boolean;
  isAdenaConnected: boolean;
  alreadyVisited: boolean;
  areTestnetsEnabled: boolean;
  sideBarExpanded: boolean;
}

const initialState: Settings = {
  selectedWalletId: "",
  selectedNetworkId: "",
  NFTStorageAPI: process.env.NFT_STORAGE_API || "",
  isKeplrConnected: false,
  isAdenaConnected: false,
  alreadyVisited: false,
  areTestnetsEnabled: false,
  sideBarExpanded: true,
};

export const selectSelectedNetworkId = (state: RootState) =>
  state.settings.selectedNetworkId;

export const selectSelectedWalletId = (state: RootState) =>
  state.settings.selectedWalletId;

export const selectIsKeplrConnected = (state: RootState) =>
  state.settings.isKeplrConnected;

export const selectIsAdenaConnected = (state: RootState) =>
  state.settings.isAdenaConnected;

export const selectAreTestnetsEnabled = (state: RootState) =>
  state.settings.areTestnetsEnabled;

export const selectSidebarExpanded = (state: RootState) =>
  state.settings.sideBarExpanded;

export const selectNFTStorageAPI = (state: RootState) =>
  state.settings.NFTStorageAPI;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSelectedNetworkId: (state, action: PayloadAction<string>) => {
      state.selectedNetworkId = action.payload;
    },
    setSelectedWalletId: (state, action: PayloadAction<string | undefined>) => {
      state.selectedWalletId = action.payload;
    },
    setIsKeplrConnected: (state, action: PayloadAction<boolean>) => {
      state.isKeplrConnected = action.payload;
    },
    setIsAdenaConnected: (state, action: PayloadAction<boolean>) => {
      state.isAdenaConnected = action.payload;
    },
    setAreTestnetsEnabled: (state, action: PayloadAction<boolean>) => {
      state.areTestnetsEnabled = action.payload;
    },
    setSidebarExpanded: (state, action: PayloadAction<boolean>) => {
      state.sideBarExpanded = action.payload;
    },
    setNFTStorageAPI: (state, action: PayloadAction<string>) => {
      state.NFTStorageAPI = action.payload;
    },
  },
});

export const {
  setSelectedNetworkId,
  setSelectedWalletId,
  setIsKeplrConnected,
  setIsAdenaConnected,
  setAreTestnetsEnabled,
  setSidebarExpanded,
  setNFTStorageAPI,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
