import { useSelector } from "react-redux";

import { selectDeveloperMode } from "@/store/slices/settings";

export const useDeveloperMode = () => {
  return useSelector(selectDeveloperMode);
};
