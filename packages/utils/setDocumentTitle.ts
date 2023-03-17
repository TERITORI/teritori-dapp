import { Platform } from "react-native";

export const setDocumentTitle = (text: string | undefined) => {
  if (Platform.OS === "web" && text && !text.includes("undefined")) {
    document.title = `Teritori - ${text}`;
  }
};
