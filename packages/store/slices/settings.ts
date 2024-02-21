import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { bech32 } from "bech32";
import { Platform } from "react-native";

import { Token as MultisigToken, Token } from "../../api/multisig/v1/multisig";
import { defaultEnabledNetworks } from "../../networks";
import { RootState } from "../store";

import { AppMode } from "@/utils/types/app-mode";

type NetworkSettings = {
  networkId: string;
  enabled: boolean;
};

export const networkSettingsAdapter = createEntityAdapter<NetworkSettings>({
  selectId: (s) => s.networkId,
});

const networkSettingsSelectors = networkSettingsAdapter.getSelectors();

export const multisigTokensAdapter = createEntityAdapter<Token>({
  selectId: (t) => t.userAddress,
});

const multisigTokensSelectors = multisigTokensAdapter.getSelectors();

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
  multisigTokens: EntityState<MultisigToken>;
  networkSettings: EntityState<NetworkSettings>;
  isLightTheme: boolean;
  developerMode: boolean;
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
  multisigTokens: multisigTokensAdapter.getInitialState(),
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

const universalUserAddress = (userAddress: string) => {
  const decoded = bech32.decode(userAddress);
  return bech32.encode("user", decoded.words);
};

export const selectMultisigToken = (
  state: RootState,
  userAddress: string | undefined,
) => {
  if (!userAddress) {
    return undefined;
  }
  let addr;
  try {
    addr = universalUserAddress(userAddress);
  } catch (error) {
    console.warn("failed to transform user address", error, userAddress);
    return undefined;
  }
  const token = multisigTokensSelectors.selectById(
    state.settings.multisigTokens,
    addr,
  );
  if (!token || Date.parse(token.expiration) <= Date.now()) {
    return undefined;
  }
  return token;
};
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
    setMultisigToken: (
      state,
      action: PayloadAction<{
        userAddress: string;
        token: MultisigToken | undefined;
      }>,
    ) => {
      if (!action.payload.token) {
        let addr;
        try {
          addr = universalUserAddress(action.payload.userAddress);
        } catch (error) {
          console.warn("failed to transform user address", error, action);
          return;
        }
        multisigTokensAdapter.removeOne(state.multisigTokens, addr);
        return;
      }
      state.multisigTokens = multisigTokensAdapter.setOne(
        state.multisigTokens,
        action.payload.token,
      );
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
  },
});

interface SettingsSession {
  locked: boolean;
}
const settingsSessionInitialState: SettingsSession = {
  locked: false,
};

const settingsSession = createSlice({
  name: "settings-session",
  initialState: settingsSessionInitialState,
  reducers: {
    setLock: (state, action: PayloadAction<boolean>) => {
      state.locked = action.payload;
    },
  },
});

export const selectIsAppLocked = (state: RootState) =>
  state.settingsSession.locked;

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
  setMultisigToken,
  toggleNetwork,
  setIsLightTheme,
  setAppMode,
  setIsChatActivated,
  setDeveloperMode,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;

export const { setLock } = settingsSession.actions;
export const settingsSessionReducer = settingsSession.reducer;
