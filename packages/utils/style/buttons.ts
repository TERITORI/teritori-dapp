export type ButtonsSize = "XL" | "M" | "SM" | "XS";

export const height = (format: ButtonsSize) => {
  switch (format) {
    case "XL":
      return 56;
    case "M":
      return 48;
    case "SM":
      return 40;
    case "XS":
      return 36;
  }
};

export const borderRadius = (format: ButtonsSize) => {
  switch (format) {
    case "XS":
      return 12;
    default:
      return 6;
  }
};
