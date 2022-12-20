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

export const replaceBetweenString = (
  origin: string,
  startIndex: number,
  endIndex: number,
  insertion: string
) =>
  `${origin.substring(0, startIndex)}${insertion}${origin.substring(endIndex)}`;
