import { useCallback } from "react";

import { useMintEnded } from "./collection/useMintEnded";

import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { parseNetworkObjectId } from "@/networks";

interface NavigateToCollectionOpts {
  forceSecondaryDuringMint?: boolean;
  forceLinkToMint?: boolean;
}

const noop = () => {};

export const useCollectionNavigationTarget = (
  id: string,
  opts?: NavigateToCollectionOpts,
) => {
  const [network, contractAddress] = parseNetworkObjectId(id);

  const secondaryDuringMint = (network?.secondaryDuringMintList || []).includes(
    contractAddress,
  );

  const noFetch = secondaryDuringMint || !!opts?.forceLinkToMint;

  const mintEnded = useMintEnded(id, !noFetch);

  const navToMint = "MintCollection";
  const navToMarketplace = "Collection";

  if (opts?.forceLinkToMint) {
    return navToMint;
  }

  if (secondaryDuringMint) {
    return navToMarketplace;
  }

  if (mintEnded === undefined) {
    return undefined;
  }

  if (mintEnded) {
    return navToMarketplace;
  }

  return navToMint;
};

export const useNavigateToCollection = (
  id: string,
  opts?: NavigateToCollectionOpts,
) => {
  const { navigate } = useAppNavigation();

  const info = useCollectionNavigationTarget(id, opts);

  const navToMint = useCallback(
    () => navigate("MintCollection", { id }),
    [navigate, id],
  );
  const navToMarketplace = useCallback(
    () => navigate("Collection", { id }),
    [navigate, id],
  );

  switch (info) {
    case "MintCollection":
      return navToMint;
    case "Collection":
      return navToMarketplace;
    default:
      return noop;
  }
};
