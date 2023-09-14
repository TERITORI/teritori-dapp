import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

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
  const contentWidth = useMemo(
    () =>
      windowWidth - (isSidebarExpanded ? fullSidebarWidth : smallSidebarWidth),
    [windowWidth, isSidebarExpanded]
  );

  const width = useMemo(() => {
    if (isMobile) {
      const mobileMargin =
        getMobileScreenContainerMarginHorizontal(windowWidth);
      return windowWidth - mobileMargin * 2;
    }
    const responsiveMargin =
      getResponsiveScreenContainerMarginHorizontal(contentWidth);
    const defaultMargin = responsive
      ? responsiveMargin
      : screenContainerContentMarginHorizontal * 2;

    return contentWidth - (noMargin ? 0 : defaultMargin);
  }, [windowWidth, noMargin, responsive, isMobile, contentWidth]);

  return {
    width: isLarge
      ? width > screenContentMaxWidthLarge
        ? screenContentMaxWidthLarge
        : width
      : width > screenContentMaxWidth
      ? screenContentMaxWidth
      : width,
    height: windowHeight - headerHeight,
    contentWidth,
  };
};
