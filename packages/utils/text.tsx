export const capitalize = (s: string) =>
  (s && s[0].toUpperCase() + s.slice(1)) || "";

export const isFloatText = (value: string) => {
  const regOnlyFloats = new RegExp(/^([0-9]*[.])?[0-9]+$|^([0-9]*[.])$/);
  return regOnlyFloats.test(value) && value !== ".";
};

export const tinyAddress = (
  fullAddress: string = "",
  totalCount: number = 10,
) => {
  if (fullAddress.length <= 13) {
    return fullAddress;
  }
  const chainIdReg = fullAddress.match(/.+?(?=\d+)/);
  const chainIdName = chainIdReg?.length ? chainIdReg[0] : "";
  const startingCharLength =
    Math.ceil(totalCount / 2) - chainIdName?.length / 2;
  const endingCharLength = Math.floor(totalCount / 2) - chainIdName?.length / 2;

  return `${fullAddress.substring(
    0,
    startingCharLength + chainIdName.length,
  )}...${fullAddress.substring(fullAddress.length - endingCharLength)}`;
};

export const replaceBetweenString = (
  origin: string,
  startIndex: number,
  endIndex: number,
  insertion: string,
) =>
  `${origin.substring(0, startIndex)}${insertion}${origin.substring(endIndex)}`;
