import { useDispatch, useSelector } from "react-redux";

import { selectAppMode, setAppMode } from "@/store/slices/settings";

export type AppMode = "normal" | "mini" | "web3Addict";

export const useAppMode = () => {
  const appMode = useSelector(selectAppMode);
  const dispatch = useDispatch();

  const handleSet = (mode: AppMode) => {
    dispatch(setAppMode(mode));
  };

  return [appMode, handleSet];
};
