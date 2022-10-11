export type BadgesSize = "M" | "SM";

export const heightBadge = (format: BadgesSize) => {
  switch (format) {
    case "M":
      return 28;
    case "SM":
      return 24;
  }
};

export const paddingHorizontalBadge = (format: BadgesSize) => {
  switch (format) {
    case "M":
      return 12;
    case "SM":
      return 10;
  }
};
