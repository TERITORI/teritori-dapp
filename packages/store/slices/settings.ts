import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { bech32 } from "bech32";

import { Token as MultisigToken, Token } from "../../api/multisig/v1/multisig";
import { defaultEnabledNetworks } from "../../networks";
import { RootState } from "../store";

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
  selectedNetworkId: string;
  selectedWalletId: string | undefined;
  NFTStorageAPI: string;
  isKeplrConnected: boolean;
  isLeapConnected: boolean;
  isAdenaConnected: boolean;
  alreadyVisited: boolean;
  areTestnetsEnabled: boolean;
  sideBarExpanded: boolean;
  howToBuyExapanded: boolean;
  multisigTokens: EntityState<MultisigToken>;
  networkSettings: EntityState<NetworkSettings>;
  isLightTheme: boolean;
}

const initialState: Settings = {
  selectedWalletId: "",
  selectedNetworkId: "",
  NFTStorageAPI: process.env.NFT_STORAGE_API || "",
  isKeplrConnected: false,
  isLeapConnected: false,
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
};

export const selectSelectedNetworkId = (state: RootState) =>
  state.settings.selectedNetworkId;

export const selectSelectedWalletId = (state: RootState) =>
  state.settings.selectedWalletId;

export const selectIsKeplrConnected = (state: RootState) =>
  state.settings.isKeplrConnected;

export const selectIsLeapConnected = (state: RootState) =>
  state.settings.isLeapConnected;

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
  setMultisigToken,
  toggleNetwork,
  setIsLightTheme,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
