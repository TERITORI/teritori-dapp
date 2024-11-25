import { useSelector } from "react-redux";

import { selectAreTestnetsEnabled } from "@/store/slices/settings";

export const useAreTestnetsEnabled = () => {
  const areTestnetsEnabled = useSelector(selectAreTestnetsEnabled);
  return areTestnetsEnabled;
};
