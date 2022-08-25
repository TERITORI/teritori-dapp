export const height = (format) => {
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

export const borderRadius = (format) => {
  switch (format) {
    case "XS":
      return 12;
    default:
      return 6;
  }
};
