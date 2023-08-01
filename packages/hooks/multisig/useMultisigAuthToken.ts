import { useSelector } from "react-redux";

import { parseUserId } from "../../networks";
import { selectMultisigToken } from "../../store/slices/settings";
import { RootState } from "../../store/store";

export const useMultisigAuthToken = (userId: string | undefined) => {
  const authToken = useSelector((state: RootState) => {
    const [, userAddress] = parseUserId(userId);
    return selectMultisigToken(state, userAddress);
  });
  return authToken;
};
