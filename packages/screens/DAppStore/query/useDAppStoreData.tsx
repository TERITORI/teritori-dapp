import { useQuery } from "@tanstack/react-query";

import { backendClient } from "../../../utils/backend";
import { dAppGroup, dAppType } from "../types";

export const useDAppStoreData = (): dAppGroup | undefined => {
  interface IdAppsLUT {
    [key: string]: {
      [key: string]: dAppType;
    };
  }

  const { data: dApps } = useQuery(
    ["DApps"],
    async () => {
      const { group } = await backendClient.DApps({});
      return group;
    },
    {
      staleTime: Infinity,
      // initialData: [],
    }
  );
  const { data: dAppsGroups } = useQuery(
    ["DAppsGroups"],
    async () => {
      const { group } = await backendClient.DAppsGroups({});
      return group;
    },
    {
      staleTime: Infinity,
      // initialData: [],
    }
  );
  if (dAppsGroups === undefined || dApps === undefined) {
    return;
  }

  const dAppsCol: IdAppsLUT = {};
  const formatted: dAppGroup = {};

  dApps.forEach((record) => {
    dAppsCol[record.airtableId] = {
      [record.id]: {
        id: record.id,
        title: record.title,
        description: record.description,
        icon: record.icon,
        route: record.route,
        groupKey: record.groupKey,
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

  return formatted;
};
