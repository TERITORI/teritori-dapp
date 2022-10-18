import React from "react";

import { OwnedNFTs } from "../../components/OwnedNFTs";
import { ScreenContainer } from "../../components/ScreenContainer";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";

/*
NOTE: this whole thing need to be rewritten using indexers and better data organisation
*/

export const MyCollectionScreen: ScreenFC<"MyCollection"> = () => {
  const selectedWallet = useSelectedWallet();
  const ownerId = `tori-${selectedWallet?.publicKey}`; // FIXME: make this network-independent
  return (
    <ScreenContainer>
      <OwnedNFTs ownerId={ownerId} style={{ marginHorizontal: 24 }} />
    </ScreenContainer>
  );
};
