// misc
import { DefaultTheme } from "styled-components/native";

import { errorColor, neutral44, neutral77, primaryColor } from "./colors";
import { styledLayout } from "./styledLayout";

/**
 * to add transparency to an hexa color, see this
 * https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4
 */

export const styledTheme: DefaultTheme = {
  colors: {
    // main
    primary: primaryColor,
    secondary: "#FFFFFF",
    error: errorColor,
    neutral44,
    neutral77,

    // others
    codGray: "#1C1C1C",
    mineShaft: "#3D3D3D",
  },
  layout: { ...styledLayout },
};
