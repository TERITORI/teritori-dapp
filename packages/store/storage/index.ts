import AsyncStorage from "@react-native-async-storage/async-storage";

import { isElectron } from "../../utils/isElectron";

export const storage = (() => {
  if (isElectron()) {
    const createElectronStorage = require("redux-persist-electron-storage");

    return createElectronStorage({
      electronStoreOpts: {
        projectName: "Teritori",
      },
    });
  }

  return AsyncStorage;
})();
