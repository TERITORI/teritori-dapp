import { useQuery } from "@tanstack/react-query";
import { merge } from "lodash";
import { memo, useEffect } from "react";

import { setAvailableApps } from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import { getMarketplaceClient } from "../../../utils/backend";
import { getAvailableApps } from "../query/getFromFile";
import { dAppGroup, dAppType } from "../types";

// FIXME: this shoudln't be a component

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
      return getMarketplaceClient(networkId)?.DApps({});
    },
    {
      cacheTime: 5 * 60 * 1000,
    }
  );
  const { data: dAppsGroups } = useQuery(
    ["DAppsGroups", networkId],
    async () => {
      return getMarketplaceClient(networkId)?.DAppsGroups({});
    },
    {
      cacheTime: 5 * 60 * 1000,
    }
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const dAppsCol: IdAppsLUT = {};
    const formatted: dAppGroup = {};

    dApps?.group.forEach((record, index) => {
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
          order: index,
        },
      };
    });

    dAppsGroups?.group.forEach((record) => {
      const options = {} as {
        [key: string]: dAppType;
      };

      record.options.forEach(function (option: string) {
        const dAppsColOption = dAppsCol[option];
        if (!dAppsColOption) return;
        dAppsColOption[Object.keys(dAppsColOption)[0]].groupKey = record.id;

        options[Object.keys(dAppsColOption)[0]] =
          dAppsColOption[Object.keys(dAppsColOption)[0]];
      });
      formatted[record.id] = {
        id: record.id,
        groupName: record.groupName,
        icon: record.icon,
        active: true,
        options,
      };
    });

    const dAppStoreValues = getAvailableApps();
    const merged = merge(formatted, dAppStoreValues);
    merged["coming-soon"] = dAppStoreValues["coming-soon"];
    dispatch(setAvailableApps(merged));
  }, [dApps, dAppsGroups, dispatch]);

  return <></>;
});
