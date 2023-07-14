import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import isElectron from "is-electron";
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
import { messageReducer } from "./slices/message";
import { notificationReducer } from "./slices/notification";
import { searchReducer } from "./slices/search";
import {
  multisigTokensAdapter,
  networkSettingsAdapter,
  settingsReducer,
} from "./slices/settings";
import { squadPresetsReducer } from "./slices/squadPresets";
import { walletsReducer } from "./slices/wallets";
import { defaultEnabledNetworks } from "../networks";

const migrations = {
  0: (state: any) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        multisigTokens: multisigTokensAdapter.getInitialState(),
        networkSettings: networkSettingsAdapter.upsertMany(
          state.settings.networkSettings,
          defaultEnabledNetworks.map((nid) => ({
            networkId: nid,
            enabled: true,
          }))
        ),
      },
    };
  },
};

const persistConfig = {
  key: "root",
  version: 0,
  migrate: createMigrate(migrations, { debug: false }),
  storage: isElectron()
    ? require("redux-persist-electron-storage")()
    : AsyncStorage,
  whitelist: [
    "wallets",
    "settings",
    "dAppsStorePersisted",
    "squadPresets",
    "marketplaceCartItems",
    "marketplaceCartItemsUI",
    "marketplaceFilters",
    "marketplaceFilterUI",
    "messages",
  ],
  blacklist: ["dAppsStore, marketplaceFilterUI"],
};

const rootReducer = combineReducers({
  wallets: walletsReducer,
  settings: settingsReducer,
  squadPresets: squadPresetsReducer,
  dAppsStorePersisted: dAppsReducerPersisted,
  dAppsStore: dAppsReducer,
  marketplaceCartItems,
  marketplaceCartItemsUI,
  marketplaceFilters,
  marketplaceFilterUI,
  search: searchReducer,
  message: messageReducer,
  notification: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
