import { useCallback } from "react";

import { useMintEnded } from "./useMintEnded";
import { parseNetworkObjectId } from "../networks";
import { useAppNavigation } from "../utils/navigation";

interface NavigateToCollectionOpts {
  forceSecondaryDuringMint?: boolean;
  forceLinkToMint?: boolean;
}

const noop = () => {};

export const useNavigateToCollection = (
  id: string,
  opts?: NavigateToCollectionOpts,
) => {
  const navigation = useAppNavigation();

  const [network, contractAddress] = parseNetworkObjectId(id);

  const secondaryDuringMint = (network?.secondaryDuringMintList || []).includes(
    contractAddress,
  );

  const noFetch = secondaryDuringMint || !!opts?.forceLinkToMint;

  const mintEnded = useMintEnded(id, !noFetch);

  const navToMint = useCallback(
    () => navigation.navigate("MintCollection", { id }),
    [navigation, id],
  );
  const navToMarketplace = useCallback(
    () => navigation.navigate("Collection", { id }),
    [navigation, id],
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
