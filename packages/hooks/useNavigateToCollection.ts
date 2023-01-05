import { useCallback } from "react";

import { secondaryDuringMintList } from "../utils/collections";
import { useAppNavigation } from "../utils/navigation";
import { useMintEnded } from "./useMintEnded";

export interface NavigateToCollectionOpts {
  forceSecondaryDuringMint?: boolean;
  forceLinkToMint?: boolean;
}

const noop = () => {};

export const useNavigateToCollection = (
  id: string,
  opts?: NavigateToCollectionOpts
) => {
  const navigation = useAppNavigation();

  const secondaryDuringMint =
    opts?.forceSecondaryDuringMint || secondaryDuringMintList.includes(id);

  const noFetch = secondaryDuringMint || !!opts?.forceLinkToMint;

  // the ternary in next line is to prevent calling the api when it's not necessary
  const mintEnded = useMintEnded(noFetch ? "" : id);

  const navToMint = useCallback(
    () => navigation.navigate("MintCollection", { id }),
    [navigation, id]
  );
  const navToMarketplace = useCallback(
    () => navigation.navigate("Collection", { id }),
    [navigation, id]
  );

  if (opts?.forceLinkToMint) {
    return navToMint;
  }

  if (secondaryDuringMint) {
    return navToMarketplace;
  }

  if (mintEnded === undefined) {
    return noop;
  }

  if (mintEnded) {
    return navToMarketplace;
  }

  return navToMint;
};
