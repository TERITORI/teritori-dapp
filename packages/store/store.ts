import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";
import { persistStore, persistReducer, createMigrate } from "redux-persist";

import { dAppsReducer, dAppsReducerPersisted } from "./slices/dapps-store";
import {
  marketplaceCartItems,
  marketplaceCartItemsUI,
} from "./slices/marketplaceCartItems";
import {
  marketplaceFilters,
  marketplaceFilterUI,
} from "./slices/marketplaceFilters";
import { messageReducer, selectIsForceChatActivated } from "./slices/message";
import { searchReducer } from "./slices/search";
import { networkSettingsAdapter, settingsReducer } from "./slices/settings";
import { squadPresetsReducer } from "./slices/squadPresets";
import {
  addressBookReducer,
  tokensReducer,
  walletsReducer,
} from "./slices/wallets";
import { storage } from "./storage";
import { defaultEnabledNetworks } from "../networks";

import { checkAndBootWeshModule } from "@/weshnet/services";

const migrations = {
  0: (state: any) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        networkSettings: networkSettingsAdapter.upsertMany(
          state.settings.networkSettings,
          defaultEnabledNetworks.map((nid) => ({
            networkId: nid,
            enabled: true,
          })),
        ),
      },
    };
  },
  1: (state: any) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        isLightTheme: false,
      },
    };
  },
  2: (state: any) => {
    return {
      ...state,
      marketplaceFilterUI: {
        ...state.marketplaceFilterUI,
        timePeriod: {
          label: "Last 1 day",
          shortLabel: "1d",
          value: 1440,
        },
      },
    };
  },
  3: (state: any) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        appMode: Platform.OS === "web" ? "normal" : "mini",
      },
    };
  },
  4: (state: any) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        developerMode: false,
      },
    };
  },
  5: (state: any) => {
    // remove multisigTokens from settings
    // TODO: init keycloak stuff
    const { multisigTokens, ...settings } = state.settings;
    return {
      ...state,
      settings,
    };
  },
};

const rootPersistConfig = {
  key: "root",
  storage,
  version: 5,
  migrate: createMigrate(migrations, { debug: false }),
  whitelist: [
    "wallets",
    "addressBook",
    "settings",
    "dAppsStorePersisted",
    "squadPresets",
    "marketplaceCartItems",
    "marketplaceCartItemsUI",
    "marketplaceFilters",
    "marketplaceFilterUI",
  ],
  blacklist: ["dAppsStore, marketplaceFilterUI", "message"],
};

const messagePersistConfig = {
  key: "message",
  storage,
  blacklist: ["isChatActivated"],
};

const rootReducer = combineReducers({
  wallets: walletsReducer,
  addressBook: addressBookReducer,
  tokens: tokensReducer,
  settings: settingsReducer,
  squadPresets: squadPresetsReducer,
  dAppsStorePersisted: dAppsReducerPersisted,
  dAppsStore: dAppsReducer,
  marketplaceCartItems,
  marketplaceCartItemsUI,
  marketplaceFilters,
  marketplaceFilterUI,
  search: searchReducer,
  message: persistReducer(messagePersistConfig, messageReducer),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

persistor.subscribe(() => {
  const { bootstrapped } = persistor.getState();
  if (bootstrapped) {
    const isForceChatActivated = selectIsForceChatActivated(store.getState());
    if (isForceChatActivated) {
      checkAndBootWeshModule();
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
