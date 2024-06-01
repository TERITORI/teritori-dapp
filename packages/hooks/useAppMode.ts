import { useDispatch, useSelector } from "react-redux";

import { selectAppMode, setAppMode } from "@/store/slices/settings";
import { AppMode } from "@/utils/types/app-mode";

export const useAppMode = (): [
  appMode: AppMode,
  handleSet: (mode: AppMode) => void,
] => {
  const appMode = useSelector(selectAppMode);
  const dispatch = useDispatch();

  const handleSet = (mode: AppMode) => {
    dispatch(setAppMode(mode));
  };

  return [appMode, handleSet];
};

export const useIsMiniMode = (): boolean => {
  const [appMode] = useAppMode();
  return appMode === "mini";
};
