import { useCallback } from "react";

import { useMintEnded } from "./collection/useMintEnded";
import { parseNetworkObjectId } from "../networks";

import { router } from "@/utils/router";

interface NavigateToCollectionOpts {
  forceSecondaryDuringMint?: boolean;
  forceLinkToMint?: boolean;
}

const noop = () => {};

export const useNavigateToCollection = (
  id: string,
  opts?: NavigateToCollectionOpts,
) => {
  const [network, contractAddress] = parseNetworkObjectId(id);

  const secondaryDuringMint = (network?.secondaryDuringMintList || []).includes(
    contractAddress,
  );

  const noFetch = secondaryDuringMint || !!opts?.forceLinkToMint;

  const mintEnded = useMintEnded(id, !noFetch);

  const navToMint = useCallback(
    () =>
      router.navigate({ pathname: "/collection/[id]/mint", params: { id } }),
    [id],
  );
  const navToMarketplace = useCallback(
    () => router.navigate({ pathname: "/collection/[id]", params: { id } }),
    [id],
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
