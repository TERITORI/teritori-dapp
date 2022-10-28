import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { useSidebar } from "../context/SidebarProvider";
import {
  fullSidebarWidth,
  headerHeight,
  screenContainerContentMarginHorizontal,
  screenContentMaxWidth,
  smallSidebarWidth,
} from "../utils/style/layout";

export const useMaxResolution = () => {
  const { width: windowWidth, height } = useWindowDimensions();
  const { isSidebarExpanded } = useSidebar();
  const width = useMemo(
    () =>
      windowWidth -
      (isSidebarExpanded ? fullSidebarWidth : smallSidebarWidth) -
      screenContainerContentMarginHorizontal * 2,
    [windowWidth, isSidebarExpanded]
  );

  return {
    width: width > screenContentMaxWidth ? screenContentMaxWidth : width,
    height: height - headerHeight,
  };
};
