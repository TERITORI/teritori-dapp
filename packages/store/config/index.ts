import AsyncStorage from "@react-native-async-storage/async-storage";

export const persistConfig = {
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
    "message",
  ],
  blacklist: ["dAppsStore, marketplaceFilterUI"],
};
