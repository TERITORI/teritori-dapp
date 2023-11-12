import { trimRight } from "./strings";

// Returns your given number (string or number), but with comma as a thousand separator (string)
export const numberWithThousandsSeparator = (
  yourBigNumber: string | number,
): string => {
  if (typeof yourBigNumber === "number") {
    return yourBigNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  if (typeof yourBigNumber === "string") {
    return yourBigNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return "?";
};

export const thousandSeparatedToNumber = (str: string): string =>
  str.replaceAll(",", "");

export const trimFixed = (val: string) => {
  if (!val.includes(".")) {
    return val;
  }
  val = trimRight(val, "0");
  return trimRight(val, ".");
};
