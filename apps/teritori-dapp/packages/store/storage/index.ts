import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = (() => {
  //TODO: fix electron renderer; then uncomment
  // if (isElectron()) {
  //   const createElectronStorage = require("redux-persist-electron-storage");

  //   return createElectronStorage({
  //     electronStoreOpts: {
  //       projectName: "Teritori",
  //     },
  //   });
  // }

  return AsyncStorage;
})();
