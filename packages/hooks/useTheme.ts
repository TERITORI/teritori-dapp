import { useSelector } from "react-redux";

import { selectIsLightTheme } from "../store/slices/settings";
import { darkTheme, lightTheme } from "../utils/themes";

export const useTheme = () => {
  const isLightThem = useSelector(selectIsLightTheme);
  return isLightThem ? lightTheme : darkTheme;
};
