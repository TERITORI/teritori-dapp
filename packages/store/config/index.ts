import AsyncStorage from "@react-native-async-storage/async-storage";

import { isElectron } from "../../utils/isElectron";

export const persistConfig = () => {
  let storage = AsyncStorage;

  if (isElectron()) {
    const createElectronStorage = require("redux-persist-electron-storage");
    storage = createElectronStorage();
  }

  return {
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
      "message",
    ],
    blacklist: ["dAppsStore, marketplaceFilterUI"],
  };
};
