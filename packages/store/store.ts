import { combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import {
  createMigrate,
  persistReducer,
  persistStore,
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
import {
  addressBookReducer,
  tokensReducer,
  walletsReducer,
} from "./slices/wallets";
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
};

const persistConfig = {
  key: "root",
  storage,
  version: 2,
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
  blacklist: ["dAppsStore, marketplaceFilterUI"],
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
  message: messageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const afterRehydrateMiddleware: Middleware = () => (next) => (action) => {
  if (action.type === REHYDRATE) {
    bootWeshModule();
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ serializableCheck: false }),
    afterRehydrateMiddleware,
  ],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
