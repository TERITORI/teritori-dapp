import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import { useIsMobile } from "../hooks/useIsMobile";
import { useIsLightTheme } from "../hooks/useTheme";
import { getValuesFromId, SEPARATOR } from "../screens/DAppStore/query/util";
import {
  selectAvailableApps,
  selectCheckedApps,
  setSelectedApps,
} from "../store/slices/dapps-store";
import {
  selectSidebarExpanded,
  setSidebarExpanded,
} from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { RWA_SIDEBAR_LIST, SIDEBAR_LIST } from "../utils/sidebar";

export const useRWASideBar = () => {
  const isSidebarExpanded = useSelector(selectSidebarExpanded);
  const dispatch = useAppDispatch();
  // on mobile sidebar is not expanded on load
  const isMobile = useIsMobile();
  const isLightTheme = useIsLightTheme();

  useEffect(() => {
    if (isMobile) {
      dispatch(setSidebarExpanded(false));
    }
  }, [dispatch, isMobile]);

  const dynamicSidebar = useMemo(
    () => RWA_SIDEBAR_LIST(isLightTheme),
    [isLightTheme],
  );

  const toggleSidebar = () => {
    dispatch(setSidebarExpanded(!isSidebarExpanded));
  };

  return {
    isSidebarExpanded,
    toggleSidebar,
    dynamicSidebar,
  };
};

export const useSidebar = () => {
  const isSidebarExpanded = useSelector(selectSidebarExpanded);
  const selectedApps = useSelector(selectCheckedApps);
  const availableApps = useSelector(selectAvailableApps);
  const dispatch = useAppDispatch();
  // on mobile sidebar is not expanded on load
  const isMobile = useIsMobile();
  useEffect(() => {
    if (isMobile) {
      dispatch(setSidebarExpanded(false));
    }
  }, [dispatch, isMobile]);

  useEffect(() => {
    if (selectedApps.length === 0 && Object.values(availableApps).length > 0) {
      dispatch(
        setSelectedApps([
          "top-apps*SEPARATOR*social-feed",
          ...Object.values(availableApps).flatMap((item) => {
            return Object.values(item.options)
              .filter((dapp) => dapp.selectedByDefault)
              .map(({ groupKey, id }) => {
                return `${groupKey}${SEPARATOR}${id}`;
              });
          }),
        ]),
      );
    }
  }, [availableApps, dispatch, selectedApps.length]);
  const dynamicSidebar = useMemo(() => {
    const dynamicAppsSelection = [] as {
      [key: string]: any;
    };

    selectedApps.map((element) => {
      const { appId, groupKey } = getValuesFromId(element);
      if (!availableApps[groupKey]) {
        return;
      }
      const option = availableApps[groupKey].options[appId];
      if (option === undefined) {
        return;
      }

      dynamicAppsSelection[element] = SIDEBAR_LIST[option.id]
        ? SIDEBAR_LIST[option.id]
        : {
            id: option.id,
            title: option.title,
            route: option.route,
            url: option.url,
            icon: option.icon,
          };
    });

    dynamicAppsSelection["dappstore"] = SIDEBAR_LIST["DAppsStore"];

    return dynamicAppsSelection;
  }, [availableApps, selectedApps]);

  const toggleSidebar = () => {
    dispatch(setSidebarExpanded(!isSidebarExpanded));
  };

  return {
    isSidebarExpanded,
    toggleSidebar,
    dynamicSidebar,
  };
};
