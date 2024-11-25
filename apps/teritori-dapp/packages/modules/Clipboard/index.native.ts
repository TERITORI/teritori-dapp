import * as ExpoClipboard from "expo-clipboard";
import Constants from "expo-constants";
const isRunningInExpoGo = Constants.appOwnership === "expo";

let Clipboard;

if (isRunningInExpoGo) {
  Clipboard = ExpoClipboard;
} else {
  const moduleName = "@react-native-clipboard/clipboard";
  Clipboard = require(moduleName).default;
  Clipboard.setStringAsync = Clipboard.setString;
  Clipboard.getStringAsync = Clipboard.getString;
}

export default Clipboard;
