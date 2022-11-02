import React from "react";

import { OwnedNFTs } from "../../components/OwnedNFTs";
import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";

/*
NOTE: this whole thing need to be rewritten using indexers and better data organisation
*/

export const MyCollectionScreen: ScreenFC<"MyCollection"> = () => {
  // variables
  const selectedWallet = useSelectedWallet();
  const ownerId = `tori-${selectedWallet?.address}`; // FIXME: make this network-independent

  // returns
  return (
    <ScreenContainer headerChildren={<BackTo label="Home" />}>
      <OwnedNFTs ownerId={ownerId} style={{ marginHorizontal: 24 }} />
    </ScreenContainer>
  );
};
