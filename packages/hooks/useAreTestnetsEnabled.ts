import { useSelector } from "react-redux";

import { useAppConfig } from "@/context/AppConfigProvider";
import { selectAreTestnetsEnabled } from "@/store/slices/settings";

export const useAreTestnetsEnabled = () => {
  const { alwaysEnableTestnets } = useAppConfig();
  const areTestnetsEnabled = useSelector(selectAreTestnetsEnabled);
  return alwaysEnableTestnets || areTestnetsEnabled;
};
