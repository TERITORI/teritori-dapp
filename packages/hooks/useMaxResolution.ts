import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import {
  screenContainerContentMarginHorizontal,
  sidebarWidth,
} from "../utils/style/layout";

export const useMaxResolution = () => {
  const { width: windowWidth } = useWindowDimensions();
  const width = useMemo(
    () =>
      windowWidth - sidebarWidth - screenContainerContentMarginHorizontal * 2,
    [windowWidth]
  );

  return { width };
};
