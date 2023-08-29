import React, { useCallback } from "react";
import { View, ViewStyle } from "react-native";

import logoSVG from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText";
import { OwnedNFTs } from "../../components/OwnedNFTs";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";

/*
  FIXME: this needs to handle all collections and all nfts
*/

export const MyCollectionScreen: ScreenFC<"MyCollection"> = () => {
  const selectedWallet = useSelectedWallet();

  const EmptyListComponent = useCallback(
    () => (
      <View style={emptyContainerStyle}>
        <SVG source={logoSVG} width={200} height={200} />
        <BrandText>My Collection</BrandText>
      </View>
    ),
    []
  );

  return (
    <ScreenContainer>
      <OwnedNFTs
        ownerId={selectedWallet?.userId || ""}
        style={{ marginHorizontal: layout.padding_x3 }}
        EmptyListComponent={EmptyListComponent}
      />
    </ScreenContainer>
  );
};

const emptyContainerStyle: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};
