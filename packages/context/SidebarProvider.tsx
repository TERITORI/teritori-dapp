import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";

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
import { SIDEBAR_LIST } from "../utils/sidebar";

interface DefaultValue {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  dynamicSidebar: { [p: string]: any };
}

const defaultValue: DefaultValue = {
  isSidebarExpanded: true,
  toggleSidebar: () => {},
  dynamicSidebar: {},
};

const SidebarContext = createContext(defaultValue);

const MOBILE_WIDTH = 768;

export const SidebarContextProvider: React.FC = ({ children }) => {
  // The entered isSidebarExpanded
  const settingIsSidebarExpanded = useSelector(selectSidebarExpanded);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(
    defaultValue.isSidebarExpanded
  );

  const selectedApps = useSelector(selectCheckedApps);
  const availableApps = useSelector(selectAvailableApps);
  const dispatch = useAppDispatch();
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
        ])
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
            icon: option.icon,
          };
    });

    dynamicAppsSelection["dappstore"] = SIDEBAR_LIST["DAppsStore"];

    return dynamicAppsSelection;
  }, [availableApps, selectedApps]);
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    setIsSidebarExpanded(
      windowWidth >= MOBILE_WIDTH ? settingIsSidebarExpanded : false
    );
  }, [settingIsSidebarExpanded, windowWidth]);

  const toggleSidebar = () => {
    dispatch(setSidebarExpanded(!isSidebarExpanded));
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <SidebarContext.Provider
      value={{
        isSidebarExpanded,
        toggleSidebar,
        dynamicSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
