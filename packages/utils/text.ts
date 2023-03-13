export const capitalize = (s: string) =>
  (s && s[0].toUpperCase() + s.slice(1)) || "";

export const thousandSeparator = (
  value: string | number,
  seperator: string
) => {
  const valueArray = value.toString().split(".");
  const thosandSeperatedValue = valueArray[0]
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, seperator);

  return thosandSeperatedValue + (valueArray[1] ? `.${valueArray[1]}` : "");
};

export const tinyAddress = (
  fullAddress: string = "",
  totalCount: number = 10
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
    startingCharLength + chainIdName.length
  )}...${fullAddress.substring(fullAddress.length - endingCharLength)}`;
};
