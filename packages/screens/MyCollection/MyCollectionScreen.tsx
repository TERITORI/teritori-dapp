import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import logoSVG from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText";
import { OwnedNFTs } from "../../components/OwnedNFTs";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useSelectedNetwork } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";
import { Network } from "../../utils/network";
import { layout } from "../../utils/style/layout";

/*
  NOTE: this whole thing need to be rewritten using indexers and better data organisation
*/

export const MyCollectionScreen: ScreenFC<"MyCollection"> = () => {
  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetwork();

  const ownerId = useMemo(() => {
    switch (selectedNetwork) {
      case Network.Ethereum:
        return `eth-${selectedWallet?.address}`;
      case Network.Teritori:
      default:
        return `tori-${selectedWallet?.address}`;
    }
  }, [selectedNetwork, selectedWallet?.address]);

  // returns
  const EmptyListComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <SVG source={logoSVG} width={200} height={200} />
        <BrandText>My Collection</BrandText>
      </View>
    ),
    []
  );

  return (
    <ScreenContainer>
      <OwnedNFTs
        ownerId={ownerId}
        style={{ marginHorizontal: layout.padding_x3 }}
        EmptyListComponent={EmptyListComponent}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
