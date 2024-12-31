import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { useIsMobile } from "./useIsMobile";

import {
  fullSidebarWidth,
  getMobileScreenContainerMarginHorizontal,
  getResponsiveScreenContainerMarginHorizontal,
  headerHeight,
  MOBILE_HEADER_HEIGHT,
  screenContainerContentMarginHorizontal,
  screenContentMaxWidth,
  screenContentMaxWidthLarge,
} from "@/utils/style/layout";

export const useMaxResolution = ({
  noMargin = false,
  responsive = true,
  isLarge = false,
} = {}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isMobile = useIsMobile();

  // If we have a different width when sidebar is expanded and when it's not, the sidebar will be laggy on certain screens (like FeedScreen)
  // So this calcul find the bigger width to have the same width no matter the sidebar state
  const contentWidth = useMemo(
    () => windowWidth - fullSidebarWidth,
    [windowWidth],
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
    height: windowHeight - (isMobile ? MOBILE_HEADER_HEIGHT : headerHeight),
    contentWidth,
  };
};
