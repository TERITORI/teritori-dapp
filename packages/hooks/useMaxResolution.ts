import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { useSidebar } from "../context/SidebarProvider";
import {
  fullSidebarWidth,
  getMobileScreenContainerMarginHorizontal,
  getResponsiveScreenContainerMarginHorizontal,
  headerHeight,
  screenContainerContentMarginHorizontal,
  screenContentMaxWidth,
  smallSidebarWidth,
} from "../utils/style/layout";
import { useIsMobile } from "./useIsMobile";

export const useMaxResolution = ({
  noMargin = false,
  responsive = true,
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

    const containerWidth =
      windowWidth - (isSidebarExpanded ? fullSidebarWidth : smallSidebarWidth);
    const responsiveMargin =
      getResponsiveScreenContainerMarginHorizontal(containerWidth);
    const defaultMargin = responsive
      ? responsiveMargin
      : screenContainerContentMarginHorizontal * 2;

    return containerWidth - (noMargin ? 0 : defaultMargin);
  }, [windowWidth, isSidebarExpanded, noMargin, responsive, isMobile]);

  return {
    width: width > screenContentMaxWidth ? screenContentMaxWidth : width,
    height: windowHeight - headerHeight,
  };
};
