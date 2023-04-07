import { Platform, useWindowDimensions } from "react-native";

import { MOBILE_MAX_WIDTH } from "../utils/style/layout";

export const useIsMobile = () => {
  const { width: windowWidth } = useWindowDimensions();
  return (
    ["android", "ios"].includes(Platform.OS) || windowWidth <= MOBILE_MAX_WIDTH
  );
};
