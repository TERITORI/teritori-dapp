import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Settings {
  selectedNetworkId: string;
  selectedWalletId: string;
  NFTStorageAPI: string;
  isKeplrConnected: boolean;
  isAdenaConnected: boolean;
  isTrustWalletConnected: boolean;
  alreadyVisited: boolean;
  areTestnetsEnabled: boolean;
}

const initialState: Settings = {
  selectedWalletId: "",
  selectedNetworkId: "teritori",
  NFTStorageAPI: process.env.NFT_STORAGE_API || "",
  isKeplrConnected: false,
  isAdenaConnected: false,
  isTrustWalletConnected: false,
  alreadyVisited: false,
  areTestnetsEnabled: false,
};

export const selectSelectedNetworkId = (state: RootState) =>
  state.settings.selectedNetworkId;

export const selectSelectedWalletId = (state: RootState) =>
  state.settings.selectedWalletId;

export const selectIsKeplrConnected = (state: RootState) =>
  state.settings.isKeplrConnected;

export const selectIsAdenaConnected = (state: RootState) =>
  state.settings.isAdenaConnected;

export const selectIsTrustWalletConnected = (state: RootState) =>
  state.settings.isTrustWalletConnected;

export const selectAreTestnetsEnabled = (state: RootState) =>
  state.settings.areTestnetsEnabled;

export const selectNFTStorageAPI = (state: RootState) =>
  state.settings.NFTStorageAPI;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSelectedNetworkId: (state, action: PayloadAction<string>) => {
      console.log(action);
      state.selectedNetworkId = action.payload;
      state.selectedWalletId = "";
    },
    setSelectedWalletId: (state, action: PayloadAction<string>) => {
      state.selectedWalletId = action.payload;
    },
    setIsKeplrConnected: (state, action: PayloadAction<boolean>) => {
      state.isKeplrConnected = action.payload;
    },
    setIsTrustWalletConnected: (state, action: PayloadAction<boolean>) => {
      state.isTrustWalletConnected = action.payload;
    },
    setIsAdenaConnected: (state, action: PayloadAction<boolean>) => {
      state.isAdenaConnected = action.payload;
    },
    setAreTestnetsEnabled: (state, action: PayloadAction<boolean>) => {
      state.areTestnetsEnabled = action.payload;
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
  setIsTrustWalletConnected,
  setIsAdenaConnected,
  setAreTestnetsEnabled,
  setNFTStorageAPI,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
