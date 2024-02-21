import {
  authenticateAsync,
  hasHardwareAsync,
  isEnrolledAsync,
} from "expo-local-authentication";
import { useSelector } from "react-redux";

import { selectIsAppLocked, setLock } from "@/store/slices/settings";
import { useAppDispatch } from "@/store/store";

export const useCheckAppLock = () => {
  const isAppLocked = useSelector(selectIsAppLocked);
  const dispatch = useAppDispatch();

  // is wallet unlocked?
  console.log(isAppLocked);
  if (isAppLocked) {
    hasHardwareAsync().then((hasHardware) => {
      console.log("hasHardware", hasHardware);
      if (hasHardware) {
        isEnrolledAsync().then((result) => {
          console.log("authenticateAsync", result);
          authenticateAsync().then((result) => {
            console.log("authenticateAsync", result);
            dispatch(setLock(!result.success));
          });
        });
      }
    });
  }
};
