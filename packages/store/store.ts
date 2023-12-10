import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import type { Reducer, Action } from "redux";
import {
  persistStore,
  persistReducer,
  createMigrate,
  REHYDRATE,
} from "redux-persist";

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
import { searchReducer } from "./slices/search";
import {
  multisigTokensAdapter,
  networkSettingsAdapter,
  settingsReducer,
} from "./slices/settings";
import { squadPresetsReducer } from "./slices/squadPresets";
import { walletsReducer } from "./slices/wallets";
import { storage } from "./storage";
import { defaultEnabledNetworks } from "../networks";
import { bootWeshModule } from "../weshnet/services";

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
};

const persistConfig = {
  key: "root",
  storage,
  version: 0,
  migrate: createMigrate(migrations, { debug: false }),
  whitelist: [
    "wallets",
    "settings",
    "dAppsStorePersisted",
    "squadPresets",
    "marketplaceCartItems",
    "marketplaceCartItemsUI",
    "marketplaceFilters",
    "marketplaceFilterUI",
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
});

const createRehydrateRootReducer: (reducer: Reducer) => Reducer =
  (reducer: (state: any, action: Action) => Reducer) =>
  (state: any, action: Action) => {
    if (action.type === REHYDRATE) {
      bootWeshModule();
    }
    return reducer(state, action);
  };

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: createRehydrateRootReducer(persistedReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
