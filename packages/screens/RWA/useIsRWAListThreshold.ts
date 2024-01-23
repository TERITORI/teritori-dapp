import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { RWA_LISTS_SIZE } from "./constants";
import { useRWASideBar } from "../../context/SidebarProvider";
import { fullSidebarWidth, smallSidebarWidth } from "../../utils/style/layout";

// TODO: Move this file in the correct directory after merged of monorepo

export const useIsRWAListThreshold = () => {
  const { width: currentWidth } = useWindowDimensions();
  const { isSidebarExpanded } = useRWASideBar();

  return useMemo(
    () =>
      currentWidth <
      RWA_LISTS_SIZE +
        (isSidebarExpanded ? fullSidebarWidth : smallSidebarWidth),
    [currentWidth, isSidebarExpanded],
  );
};
