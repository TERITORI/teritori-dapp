import { has, cloneDeep } from "lodash";
import { useEffect, useMemo } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";

import { useIsMobile } from "../hooks/useIsMobile";
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
import { SIDEBAR_LIST } from "../utils/sidebar";

import { useIsUserLaunchpadAdmin } from "@/hooks/launchpad/useIsUserLaunchpadAdmin";
import { useDeveloperMode } from "@/hooks/useDeveloperMode";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getValuesFromId, SEPARATOR } from "@/utils/dapp-store";

export const useSidebar = () => {
  const isSidebarExpanded = useSelector(selectSidebarExpanded);
  const selectedApps = useSelector(selectCheckedApps);
  const availableApps = useSelector(selectAvailableApps);
  const userId = useSelectedWallet()?.userId;
  const { isUserLaunchpadAdmin } = useIsUserLaunchpadAdmin(userId);

  const [developerMode] = useDeveloperMode();
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

    selectedApps
      .filter((element) => {
        const { appId, groupKey } = getValuesFromId(element);
        if (!availableApps[groupKey]) {
          return false;
        }
        const option = availableApps[groupKey].options[appId];
        if (option === undefined) {
          return false;
        }
        if (option.devOnly && !developerMode) {
          return false;
        }
        return true;
      })
      .map((element) => {
        const { appId, groupKey } = getValuesFromId(element);
        if (!availableApps[groupKey]) {
          return;
        }
        const option = availableApps[groupKey].options[appId];
        if (option === undefined) {
          return;
        }

        if (SIDEBAR_LIST[option.id]) {
          const newOption = cloneDeep(SIDEBAR_LIST[option.id]);

          // Sidebar restriction (Hide items or nested items):
          // Launchpad Admin
          if (
            !isUserLaunchpadAdmin &&
            newOption.id === "Launchpad" &&
            newOption.nested &&
            has(newOption, "nested.admin")
          ) {
            delete newOption.nested.admin;
          }

          dynamicAppsSelection[element] = newOption;
        } else {
          dynamicAppsSelection[element] = {
            id: option.id,
            title: option.title,
            route: option.route,
            url: option.url,
            icon: option.icon,
          };
        }
      });

    dynamicAppsSelection["dappstore"] = SIDEBAR_LIST["DAppsStore"];

    return dynamicAppsSelection;
  }, [availableApps, selectedApps, developerMode, isUserLaunchpadAdmin]);

  const toggleSidebar = () => {
    dispatch(setSidebarExpanded(!isSidebarExpanded));
  };

  return {
    isSidebarExpanded: Platform.OS === "web" ? isSidebarExpanded : true,
    toggleSidebar,
    dynamicSidebar,
  };
};
