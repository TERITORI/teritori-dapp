import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { useSidebar } from "../context/SidebarProvider";
import {
  fullSidebarWidth,
  headerHeight,
  mobileScreenContainerContentMarginHorizontal,
  screenContainerContentMarginHorizontal,
  screenContentMaxWidth,
  smallSidebarWidth,
} from "../utils/style/layout";
import { useIsMobile } from "./useMobile";

export const useMaxResolution = ({ noMargin = false } = {}) => {
  const { width: windowWidth, height } = useWindowDimensions();
  const isMobile = useIsMobile();
  const { isSidebarExpanded } = useSidebar();

  const margin = isMobile
    ? mobileScreenContainerContentMarginHorizontal
    : screenContainerContentMarginHorizontal;
  const sideBarWidth = isMobile
    ? 0
    : isSidebarExpanded
    ? fullSidebarWidth
    : smallSidebarWidth;
  const width = useMemo(
    () => windowWidth - sideBarWidth - (noMargin ? 0 : margin * 2),
    [windowWidth, isSidebarExpanded]
  );

  return {
    width: width > screenContentMaxWidth ? screenContentMaxWidth : width,
    height: height - headerHeight,
  };
};
