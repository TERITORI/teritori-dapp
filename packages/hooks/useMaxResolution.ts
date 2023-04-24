import { useMemo } from "react";
import { useWindowDimensions, Platform } from "react-native";

import { useIsMobile } from "./useIsMobile";
import { useSidebar } from "../context/SidebarProvider";
import {
  fullSidebarWidth,
  getMobileScreenContainerMarginHorizontal,
  getResponsiveScreenContainerMarginHorizontal,
  headerHeight,
  screenContainerContentMarginHorizontal,
  screenContentMaxWidth,
  screenContentMaxWidthLarge,
  smallSidebarWidth,
} from "../utils/style/layout";

export const useMaxResolution = ({
  noMargin = false,
  responsive = true,
  isLarge = false,
} = {}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { isSidebarExpanded } = useSidebar();
  const isMobile = useIsMobile();

  const width = useMemo(() => {
    if (isMobile) {
      const mobileMargin =
        getMobileScreenContainerMarginHorizontal(windowWidth);
      return windowWidth - mobileMargin * 2;
    }

    const sidebarWidthFix = isSidebarExpanded
      ? fullSidebarWidth
      : smallSidebarWidth;

    const containerWidth =
      Platform.OS === "web" ? windowWidth - sidebarWidthFix : windowWidth;
    const responsiveMargin =
      getResponsiveScreenContainerMarginHorizontal(containerWidth);
    const defaultMargin = responsive
      ? responsiveMargin
      : screenContainerContentMarginHorizontal * 2;

    return containerWidth - (noMargin ? 0 : defaultMargin);
  }, [windowWidth, isSidebarExpanded, noMargin, responsive, isMobile]);

  return {
    width: isLarge
      ? width > screenContentMaxWidthLarge
        ? screenContentMaxWidthLarge
        : width
      : width > screenContentMaxWidth
      ? screenContentMaxWidth
      : width,
    height: windowHeight - headerHeight,
  };
};
