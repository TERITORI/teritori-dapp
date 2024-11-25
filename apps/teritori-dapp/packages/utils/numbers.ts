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

const units = ["", "K", "M", "B", "T", "P", "E", "Z", "Y"];

export function prettyNumber(val: number, maxDecimals: number) {
  let unitIndex = 0;
  while (val >= 1000 && unitIndex !== units.length - 1) {
    val /= 1000;
    unitIndex++;
  }
  return `${trimFixed(val.toFixed(maxDecimals))}${units[unitIndex]}`;
}
