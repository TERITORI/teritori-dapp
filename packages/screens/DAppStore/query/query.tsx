import { getFromAirTable } from "./getFromAirTable";

export const getFromAPI = async () => {
  const data = await getFromAirTable();
  if (data) {
  }
};

export function getSelectedApps(): string[] {
  return window.localStorage.getItem("teritori-dappstore")
    ? Array.from(
        JSON.parse(window.localStorage.getItem("teritori-dappstore") as string)
      )
    : [];
}

export function getValuesFromId(option: string) {
  const separator = "*SEPARATOR*";
  const separatorLen = separator.length;
  const offset = option.indexOf(separator);
  const appId = option.substring(offset + separatorLen);
  const groupKey = option.substring(0, offset);
  return { appId, groupKey };
}
