import * as R from "ramda";

// Returns your given number (string or number), but with comma as a thousand separator (string)
export const numberWithThousandsSeparator = (
  yourBigNumber: string | number
): string => {
  if (typeof yourBigNumber === "number") {
    return yourBigNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  if (typeof yourBigNumber === "string") {
    return yourBigNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

export const thousandSeparatedToNumber = (str: string): string =>
  str.replaceAll(",", "");

// Get the tld at the end of a token (NSB) (.xxxx)
export const tldFromToken = (str: string): string =>
  str.substring(str.lastIndexOf("."));
// Get the token (NSB) without the tld
export const tokenWithoutTld = (str: string): string =>
  str.substr(0, str.lastIndexOf("."));

export const isTokenOwned = (tokenArray: string[], name: string) => {
  return tokenArray.includes(name + process.env.TLD);
};
