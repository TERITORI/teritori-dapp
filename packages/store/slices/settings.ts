import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Platform } from "react-native";

import { RootState } from "../store";

import { defaultEnabledNetworks } from "@/networks";
import { AppMode } from "@/utils/types/app-mode";

type NetworkSettings = {
  networkId: string;
  enabled: boolean;
};

export const networkSettingsAdapter = createEntityAdapter<NetworkSettings>({
  selectId: (s) => s.networkId,
});

const networkSettingsSelectors = networkSettingsAdapter.getSelectors();

interface Settings {
  appMode: AppMode;
  isChatActivated: boolean;
  selectedNetworkId: string;
  selectedWalletId: string | undefined;
  NFTStorageAPI: string;
  isKeplrConnected: boolean;
  isLeapConnected: boolean;
  isNativeWalletConnected: boolean;
  isAdenaConnected: boolean;
  alreadyVisited: boolean;
  areTestnetsEnabled: boolean;
  sideBarExpanded: boolean;
  howToBuyExapanded: boolean;
  networkSettings: EntityState<NetworkSettings>;
  isLightTheme: boolean;
  developerMode: boolean;
  keycloakToken?: string;
  keycloakRefreshToken?: string;
  keycloakIdToken?: string;
}

const initialState: Settings = {
  appMode: Platform.OS === "web" ? "normal" : "mini",
  isChatActivated: false,
  selectedWalletId: "",
  selectedNetworkId: "",
  NFTStorageAPI: process.env.NFT_STORAGE_API || "",
  isKeplrConnected: false,
  isLeapConnected: false,
  isNativeWalletConnected: false,
  isAdenaConnected: false,
  howToBuyExapanded: true,
  alreadyVisited: false,
  areTestnetsEnabled: false,
  sideBarExpanded: true,
  networkSettings: networkSettingsAdapter.upsertMany(
    networkSettingsAdapter.getInitialState(),
    defaultEnabledNetworks.map((nid) => ({
      networkId: nid,
      enabled: true,
    })),
  ),
  isLightTheme: false,
  developerMode: false,
};

export const selectAppMode = (state: RootState) => state.settings.appMode;

export const selectIsChatActivated = (state: RootState) =>
  state.settings.isChatActivated;

export const selectSelectedNetworkId = (state: RootState) =>
  state.settings.selectedNetworkId;

export const selectSelectedWalletId = (state: RootState) =>
  state.settings.selectedWalletId;

export const selectIsKeplrConnected = (state: RootState) =>
  state.settings.isKeplrConnected;

export const selectIsLeapConnected = (state: RootState) =>
  state.settings.isLeapConnected;

export const selectINativeWalletConnected = (state: RootState) =>
  state.settings.isNativeWalletConnected;

export const selectIsAdenaConnected = (state: RootState) =>
  state.settings.isAdenaConnected;

export const selectAreTestnetsEnabled = (state: RootState) =>
  state.settings.areTestnetsEnabled;

export const selectSidebarExpanded = (state: RootState) =>
  state.settings.sideBarExpanded;

export const selectIsHowToBuyExpanded = (state: RootState) =>
  state.settings.howToBuyExapanded;

export const selectNFTStorageAPI = (state: RootState) =>
  state.settings.NFTStorageAPI;

export const selectDeveloperMode = (state: RootState) =>
  state.settings.developerMode;

export const selectKeycloakToken = (state: RootState) =>
  state.settings.keycloakToken;

export const selectKeycloakRefreshToken = (state: RootState) =>
  state.settings.keycloakToken;

export const selectKeycloakIdToken = (state: RootState) =>
  state.settings.keycloakIdToken;

export const selectNetworkEnabled = (
  state: RootState,
  networkId: string | undefined,
) => {
  if (!networkId) {
    return false;
  }
  const networkSettings = networkSettingsSelectors.selectById(
    state.settings.networkSettings,
    networkId,
  );
  return !!networkSettings?.enabled;
};

export const selectNetworksSettings = (state: RootState) =>
  networkSettingsSelectors.selectEntities(state.settings.networkSettings);

export const selectIsLightTheme = (state: RootState) =>
  state.settings.isLightTheme;

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
    setIsLeapConnected: (state, action: PayloadAction<boolean>) => {
      state.isLeapConnected = action.payload;
    },
    setIsNativeWalletConnected: (state, action: PayloadAction<boolean>) => {
      state.isNativeWalletConnected = action.payload;
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
    setHowToBuyExpanded: (state, action: PayloadAction<boolean>) => {
      state.howToBuyExapanded = action.payload;
    },
    setNFTStorageAPI: (state, action: PayloadAction<string>) => {
      state.NFTStorageAPI = action.payload;
    },
    toggleNetwork: (state, action: PayloadAction<{ networkId: string }>) => {
      const networkSettings = networkSettingsSelectors.selectById(
        state.networkSettings,
        action.payload.networkId,
      );
      if (!networkSettings) {
        networkSettingsAdapter.addOne(state.networkSettings, {
          networkId: action.payload.networkId,
          enabled: true,
        });
        return;
      }
      networkSettingsAdapter.updateOne(state.networkSettings, {
        id: action.payload.networkId,
        changes: {
          enabled: !networkSettings.enabled,
        },
      });
    },
    setIsLightTheme: (state, action: PayloadAction<boolean>) => {
      state.isLightTheme = action.payload;
    },
    setAppMode: (state, action: PayloadAction<AppMode>) => {
      state.appMode = action.payload;
    },
    setIsChatActivated: (state, action: PayloadAction<boolean>) => {
      state.isChatActivated = action.payload;
    },
    setDeveloperMode: (state, action: PayloadAction<boolean>) => {
      state.developerMode = action.payload;
    },
    setKeycloakToken: (state, action: PayloadAction<string | undefined>) => {
      state.keycloakToken = action.payload;
    },
    setKeycloakRefreshToken: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.keycloakRefreshToken = action.payload;
    },
    setKeycloakIdToken: (state, action: PayloadAction<string | undefined>) => {
      state.keycloakIdToken = action.payload;
    },
  },
});

export const {
  setSelectedNetworkId,
  setSelectedWalletId,
  setIsKeplrConnected,
  setIsLeapConnected,
  setIsAdenaConnected,
  setAreTestnetsEnabled,
  setSidebarExpanded,
  setHowToBuyExpanded,
  setNFTStorageAPI,
  toggleNetwork,
  setIsLightTheme,
  setAppMode,
  setIsChatActivated,
  setDeveloperMode,
  setKeycloakToken,
  setKeycloakRefreshToken,
  setKeycloakIdToken,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
