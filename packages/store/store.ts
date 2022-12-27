import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";

import { dAppsReducer } from "./slices/dapps-store";
import { settingsReducer } from "./slices/settings";
import { walletsReducer } from "./slices/wallets";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["wallets", "settings"],
};

const rootReducer = combineReducers({
  wallets: walletsReducer,
  settings: settingsReducer,
  dAppsStore: dAppsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
