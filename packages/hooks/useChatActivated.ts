import { useDispatch, useSelector } from "react-redux";

import {
  selectIsChatActivated,
  setIsChatActivated,
} from "@/store/slices/settings";

export const useChatActivated = (): [
  isChatActivated: boolean,
  (status: boolean) => void,
] => {
  const isChatActivated = useSelector(selectIsChatActivated);
  const dispatch = useDispatch();

  const handleSet = (status: boolean) => {
    dispatch(setIsChatActivated(status));
  };

  return [isChatActivated, handleSet];
};
