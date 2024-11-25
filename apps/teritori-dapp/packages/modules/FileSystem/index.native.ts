import Constants from "expo-constants";
import * as ExpoFileSystem from "expo-file-system";

const isRunningInExpoGo = Constants.appOwnership === "expo";

let FileSystem = ExpoFileSystem;

if (isRunningInExpoGo) {
  FileSystem = ExpoFileSystem;
} else {
  const moduleName = "react-native-fs";
  const RNFS = require(moduleName);
  //TODO: patch other expo file system functions
  FileSystem = {
    ...ExpoFileSystem,
    readAsStringAsync: async (uri, options) => {
      return await RNFS.readFile(uri, options?.encoding);
    },
    writeAsStringAsync: async (uri, content, options) => {
      return await RNFS.writeFile(uri, content, options?.encoding);
    },
  };
}

export default FileSystem;
