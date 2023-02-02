import Airtable from "airtable";

import { dAppGroup, dAppType } from "../types";

export async function getFromAirTable(): Promise<dAppGroup> {
  interface IdAppsLUT {
    [key: string]: {
      [key: string]: dAppType;
    };
  }

  const dApps: IdAppsLUT = {};
  const formatted: dAppGroup = {};

  if (!process.env.AIRTABLE_DAPP_BASE) {
    throw new Error("Env Var AIRTABLE_DAPP_BASE is required");
  }
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_DAPP_BASE);

  // @ts-ignore
  const getIcon = <TFields extends any>(record: Record<TFields>) =>
    record.get("icon")[0] ? record.get("icon")[0].url : "";

  const dAppsRecords = await base("dApps")
    .select({
      view: "Grid view",
    })
    .all();

  dAppsRecords.forEach((record) => {
    dApps[record.id] = {
      // @ts-ignore
      [record.get("id")]: {
        id: record.get("id"),
        title: record.get("title"),
        description: record.get("description"),
        icon: getIcon(record),
        route: record.get("route"),
        groupKey: "",
      },
    };
  });

  const dAppsGroups = await base("dAppsGroup")
    .select({
      view: "Grid view",
    })
    .all();

  dAppsGroups.forEach((record) => {
    const options = {};
    // @ts-ignore
    record.get("options").forEach(function (option: string) {
      // @ts-ignore
      dApps[option][Object.keys(dApps[option])[0]].groupKey = record.get("id");

      // @ts-ignore
      options[Object.keys(dApps[option])[0]] =
        dApps[option][Object.keys(dApps[option])[0]];
    });
    // @ts-ignore
    formatted[record.get("id")] = {
      id: record.get("id"),
      groupName: record.get("title"),
      icon: getIcon(record),
      active: true,
      options,
    };
  });

  return formatted;
}
