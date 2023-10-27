import { useSelector } from "react-redux";

import { selectIsLightTheme } from "../store/slices/settings";
import { darkTheme, lightTheme, Theme } from "../utils/themes";

export const useTheme = (): Theme => {
  const isLightThem = useSelector(selectIsLightTheme);
  return isLightThem ? lightTheme : darkTheme;
};
