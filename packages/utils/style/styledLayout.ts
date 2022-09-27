// libraries
import { Dimensions } from "react-native";
import { DefaultTheme } from "styled-components/native";

const { width, height } = Dimensions.get("window");
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export const styledLayout: DefaultTheme["layout"] = {
  window: { width, height },
  screen: { width: screenWidth, height: screenHeight },
  padding_x1: 8,
  get padding_x0_5() {
    return this.padding_x1 * 0.5; // 4
  },
  get padding_x1_5() {
    return this.padding_x1 * 1.5; // 12
  },
  get padding_x2() {
    return this.padding_x1 * 2; // 16
  },
  get padding_x2_5() {
    return this.padding_x1 * 2.5; // 20
  },
  get padding_x3() {
    return this.padding_x1 * 3; // 24
  },
  get padding_x3_5() {
    return this.padding_x1 * 3.5; // 28
  },
  get padding_x4() {
    return this.padding_x1 * 4; // 32
  },
  borderRadius: 12,
  contentPadding: 48,
  icon: 32,
};
