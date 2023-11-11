import { useSelector } from "react-redux";

import { selectIsLightTheme } from "../store/slices/settings";
import { darkTheme, lightTheme, Theme } from "../utils/themes";

export const useIsLightTheme = (): boolean => {
  return useSelector(selectIsLightTheme);
};

export const useTheme = (): Theme => {
  return useIsLightTheme() ? lightTheme : darkTheme;
};
