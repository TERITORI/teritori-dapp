import { useWindowDimensions } from "react-native";

import { useSidebar } from "../context/SidebarProvider";
import {
  fullSidebarWidth,
  headerHeight,
  screenContainerContentMarginHorizontal,
  screenContentMaxWidth,
  smallSidebarWidth,
} from "../utils/style/layout";

export const useMaxResolution = ({ noMargin = false } = {}) => {
  const { width: windowWidth, height } = useWindowDimensions();
  const { isSidebarExpanded } = useSidebar();
  const width =
    windowWidth -
    (isSidebarExpanded ? fullSidebarWidth : smallSidebarWidth) -
    (noMargin ? 0 : screenContainerContentMarginHorizontal * 2);

  return {
    width: width > screenContentMaxWidth ? screenContentMaxWidth : width,
    height: height - headerHeight,
  };
};
