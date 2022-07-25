import { useEffect } from "react";

import { tokenWithoutTld } from "../utils/handefulFunctions";
import { noTokens, useTokenList } from "./tokens";

export const useIsUserOwnsToken = (tokenId: string): boolean => {
  const { tokens } = useTokenList();
  return tokens.includes(tokenId + process.env.TLD);
};
