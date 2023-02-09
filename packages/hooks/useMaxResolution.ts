import { useWindowDimensions } from "react-native";

import { useSidebar } from "../context/SidebarProvider";
import {
  fullSidebarWidth,
  getResponsiveScreenContainerMarginHorizontal,
  headerHeight,
  screenContainerContentMarginHorizontal,
  screenContentMaxWidth,
  smallSidebarWidth,
} from "../utils/style/layout";

export const useMaxResolution = ({
  noMargin = false,
  responsive = true,
} = {}) => {
  const { width: windowWidth, height } = useWindowDimensions();
  const { isSidebarExpanded } = useSidebar();
  const width = useMemo(() => {
    const containerWidth =
      windowWidth - (isSidebarExpanded ? fullSidebarWidth : smallSidebarWidth);
    const responsiveMargin =
      getResponsiveScreenContainerMarginHorizontal(containerWidth);
    const defaultMargin = responsive
      ? responsiveMargin
      : screenContainerContentMarginHorizontal * 2;
    return containerWidth - (noMargin ? 0 : defaultMargin);
  }, [windowWidth, isSidebarExpanded]);

  return {
    width: width > screenContentMaxWidth ? screenContentMaxWidth : width,
    height: height - headerHeight,
  };
};
