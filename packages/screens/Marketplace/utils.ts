import { neutral00, purpleDark, yellowDefault } from "../../utils/style/colors";

export const resolveColor = (
  type: "backgroundColor" | "color",
  rareRatio: number,
) => {
  switch (type) {
    case "backgroundColor":
      return rareRatio > 5
        ? "rgba(22, 187, 255, 0.16)"
        : rareRatio < 1
          ? purpleDark
          : yellowDefault;
    case "color":
      return rareRatio > 5
        ? "white"
        : rareRatio < 1
          ? yellowDefault
          : neutral00;
  }
};
