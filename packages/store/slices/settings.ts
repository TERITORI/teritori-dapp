import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Wallet } from "../../context/WalletsProvider";
import { RootState } from "../store";

interface Settings {
  selectedNetworkId: string;
  selectedWalletId: string;
  NFTStorageAPI: string;
  isKeplrConnected: boolean;
  alreadyVisited: boolean;
  areTestnetsEnabled: boolean;
}

const initialState: Settings = {
  selectedWalletId: "",
  selectedNetworkId: "",
  NFTStorageAPI: process.env.NFT_STORAGE_API || "",
  isKeplrConnected: false,
  alreadyVisited: false,
  areTestnetsEnabled: false,
};

export const selectSelectedNetworkId = (state: RootState) =>
  state.settings.selectedNetworkId;

export const selectSelectedWalletId = (state: RootState) =>
  state.settings.selectedWalletId;

export const selectIsKeplrConnected = (state: RootState) =>
  state.settings.isKeplrConnected;

export const selectAreTestnetsEnabled = (state: RootState) =>
  state.settings.areTestnetsEnabled;

export const selectNFTStorageAPI = (state: RootState) =>
  state.settings.NFTStorageAPI;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSelectedNetworkId: (state, action: PayloadAction<string>) => {
      state.selectedNetworkId = action.payload;
      state.selectedWalletId = "";
    },
    setSelectedWallet: (state, action: PayloadAction<Wallet | undefined>) => {
      if (!action.payload) {
        return;
      }
      state.selectedWalletId = action.payload.id;
      state.selectedNetworkId = action.payload.networkId;
    },
    setIsKeplrConnected: (state, action: PayloadAction<boolean>) => {
      state.isKeplrConnected = action.payload;
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
  setSelectedWallet,
  setIsKeplrConnected,
  setAreTestnetsEnabled,
  setNFTStorageAPI,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
