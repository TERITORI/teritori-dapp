import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

import { setAvailableApps } from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import { getMarketplaceClient } from "../../../utils/backend";
import { failbackDapps, fallbackDappGroups } from "../query/fallbackValues";
import { dAppGroup, dAppType } from "../types";

export const DAppStoreData: React.FC = memo(() => {
  interface IdAppsLUT {
    [key: string]: {
      [key: string]: dAppType;
    };
  }
  const networkId = "teritori"; // there is no difference between the networks

  const { data: dApps } = useQuery(
    ["DApps", networkId],
    async () => {
      // @ts-expect-error
      const { group } = await getMarketplaceClient(networkId).DApps({});
      return group;
    },
    {
      cacheTime: 5 * 60 * 1000,
      initialData: failbackDapps,
    }
  );
  const { data: dAppsGroups } = useQuery(
    ["DAppsGroups", networkId],
    async () => {
      // @ts-expect-error
      const { group } = await getMarketplaceClient(networkId).DAppsGroups({});
      return group;
    },
    {
      cacheTime: 5 * 60 * 1000,
      initialData: fallbackDappGroups,
    }
  );

  const dAppsCol: IdAppsLUT = {};
  const formatted: dAppGroup = {};

  dApps.forEach((record) => {
    dAppsCol[record.linkingId] = {
      [record.id]: {
        id: record.id,
        title: record.title,
        description: record.description,
        icon: record.icon,
        route: record.route,
        groupKey: record.groupKey,
        selectedByDefault: record.selectedByDefault,
        alwaysOn: record.alwaysOn,
      },
    };
  });

  dAppsGroups.forEach((record) => {
    const options = {} as {
      [key: string]: dAppType;
    };

    record.options.forEach(function (option: string) {
      dAppsCol[option][Object.keys(dAppsCol[option])[0]].groupKey = record.id;

      options[Object.keys(dAppsCol[option])[0]] =
        dAppsCol[option][Object.keys(dAppsCol[option])[0]];
    });
    formatted[record.id] = {
      id: record.id,
      groupName: record.groupName,
      icon: record.icon,
      active: true,
      options,
    };
  });
  const dispatch = useAppDispatch();
  dispatch(setAvailableApps(formatted));
  return <></>;
});
