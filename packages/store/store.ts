import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";

import { dAppsReducer, dAppsReducerPersisted } from "./slices/dapps-store";
import {
  marketplaceCartItems,
  marketplaceCartItemsUI,
} from "./slices/marketplaceCartItems";
import {
  marketplaceFilters,
  marketplaceFilterUI,
} from "./slices/marketplaceFilters";
import { searchReducer } from "./slices/search";
import { settingsReducer } from "./slices/settings";
import { squadPresetsReducer } from "./slices/squadPresets";
import { walletsReducer } from "./slices/wallets";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
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
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
