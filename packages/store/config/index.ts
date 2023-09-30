import AsyncStorage from "@react-native-async-storage/async-storage";

import { isElectron } from "../../utils/isElectron";

export const persistConfig = () => {
  let storage = AsyncStorage;

  if (isElectron()) {
    const createElectronStorage = require("redux-persist-electron-storage");
    storage = createElectronStorage();
  }

  const config = {
    key: "root",
    storage,
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

  if (isElectron()) {
    config.whitelist.push("message");
  }

  return config;
};
