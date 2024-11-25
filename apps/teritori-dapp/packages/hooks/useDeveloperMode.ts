import { useCallback } from "react";
import { useSelector } from "react-redux";

import { selectDeveloperMode, setDeveloperMode } from "@/store/slices/settings";
import { useAppDispatch } from "@/store/store";

export const useDeveloperMode = () => {
  const value = useSelector(selectDeveloperMode);
  const dispatch = useAppDispatch();
  const setter = useCallback(
    (newValue: boolean) => {
      dispatch(setDeveloperMode(newValue));
    },
    [dispatch],
  );
  return [value, setter] as const;
};
