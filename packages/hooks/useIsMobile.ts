import { useWindowDimensions } from "react-native";

import { MOBILE_MAX_WIDTH } from "../utils/style/layout";

export const useIsMobile = () => {
  const { width: windowWidth } = useWindowDimensions();
  return windowWidth <= MOBILE_MAX_WIDTH;
};
