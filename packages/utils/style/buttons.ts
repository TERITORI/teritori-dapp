export const height = (format) => {
  switch (format) {
    case "XL":
      return 58;
    case "M":
      return 50;
    case "SM":
      return 42;
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
