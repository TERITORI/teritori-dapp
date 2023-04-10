export const SEPARATOR = "*SEPARATOR*";

export function getValuesFromId(option: string) {
  const separator = SEPARATOR;
  const separatorLen = separator.length;
  const offset = option.indexOf(separator);
  const appId = option.substring(offset + separatorLen);
  const groupKey = option.substring(0, offset);
  return { appId, groupKey };
}
