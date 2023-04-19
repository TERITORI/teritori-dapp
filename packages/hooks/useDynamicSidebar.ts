import { useMemo } from "react";
import { useSelector } from "react-redux";

import { getValuesFromId, SEPARATOR } from "../screens/DAppStore/query/util";
import {
  selectAvailableApps,
  selectCheckedApps,
  setSelectedApps,
} from "../store/slices/dapps-store";
import { useAppDispatch } from "../store/store";
import { SIDEBAR_LIST } from "../utils/sidebar";

export const useDynamicSidebar = () => {
  const selectedApps = useSelector(selectCheckedApps);
  const availableApps = useSelector(selectAvailableApps);
  const dispatch = useAppDispatch();
  const dynamicSidebar = useMemo(() => {
    if (selectedApps.length === 0 && Object.values(availableApps).length > 0) {
      dispatch(
        setSelectedApps(
          Object.values(availableApps).flatMap((item) => {
            return Object.values(item.options)
              .filter((dapp) => dapp.selectedByDefault)
              .map(({ groupKey, id }) => {
                return `${groupKey}${SEPARATOR}${id}`;
              });
          })
        )
      );
    }
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
        /*
         we found something inconsistent between the selected apps and what is available.
         I will reset user selection to go back to a sane state
         */
        dispatch(setSelectedApps([]));
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
  }, [selectedApps, availableApps, dispatch]);
  return { dynamicSidebar };
};
