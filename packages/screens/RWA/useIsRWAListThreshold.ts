import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { useRWASideBar } from "../../context/SidebarProvider";
import { fullSidebarWidth, smallSidebarWidth } from "../../utils/style/layout";

// TODO: Move this file in the correct directory after merged of monorepo

export const useIsRWAListThreshold = () => {
  const { width: currentWidth } = useWindowDimensions();
  const { isSidebarExpanded } = useRWASideBar();

  // 1184 = width of rwa lists
  return useMemo(
    () =>
      currentWidth <
      1184 + (isSidebarExpanded ? fullSidebarWidth : smallSidebarWidth),
    [currentWidth, isSidebarExpanded],
  );
};
