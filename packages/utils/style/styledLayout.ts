// libraries
import { Dimensions } from "react-native";
import { DefaultTheme } from "styled-components/native";

const { width, height } = Dimensions.get("window");
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export const styledLayout: DefaultTheme["layout"] = {
  window: { width, height },
  screen: { width: screenWidth, height: screenHeight },
  padding: 32,
  borderRadius: 12,
  contentPadding: 48,
};
