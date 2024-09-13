import { useMaxResolution } from "./useMaxResolution";

import { ScreenSizeBreakpoints } from "@/utils/style/layout";

export const useScreenSize = () => {
  const { width } = useMaxResolution();

  if (width < 500) {
    return ScreenSizeBreakpoints.SMALL;
  } else if (width >= 500 && width < 800) {
    return ScreenSizeBreakpoints.MEDIUM;
  } else {
    return ScreenSizeBreakpoints.BIG;
  }
};
