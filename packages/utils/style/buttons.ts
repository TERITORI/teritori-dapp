export type ButtonsSize = "XL" | "M" | "SM" | "XS";

export const heightButton = (format: ButtonsSize) => {
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

export const borderRadiusButton = (format: ButtonsSize) => {
  switch (format) {
    case "XS":
      return 12;
    default:
      return 6;
  }
};

export const heightDropdownButton = (format: ButtonsSize) => {
  switch (format) {
    case "SM":
      return 40;
    case "XS":
      return 24;
  }
};

export const cornerWidthDropdownButton = (format: ButtonsSize) => {
  switch (format) {
    case "XS":
      return 5;
    default:
      return 8;
  }
};
