import React, { useEffect } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";

import { CenterSection } from "./component/CenterSection";
import { GameBgCard } from "./component/GameBgCard";
import { GameBgOverlay } from "./component/GameBgOverlay";
import { RiotGameHeader } from "./component/RiotGameHeader";

import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { gameBgData } from "@/utils/game";
import { neutral00 } from "@/utils/style/colors";
import { headerHeight } from "@/utils/style/layout";
import { mustGetLauchpadClient } from "@/utils/backend";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { Metadata, Trait } from "@/api/launchpad/v1/launchpad";

export const RiotGameScreen = () => {
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  const { width, height } = useWindowDimensions();
  const cardSize = {
    height: (height - headerHeight) / 5,
    width: width / 10,
  };

  const gotoEnroll = () => {
    navigation.navigate("RiotGameEnroll");
  };

   const uploadMetadata = async () => {
    let client = mustGetLauchpadClient(networkId);

    const nft0 = {
      image: "image0",
      imageData: "",
      externalUrl: "",
      description: "",
      name: "nft #0",
      attributes: [
        {traitType: "type0", value: "value0"},
        {traitType: "type1", value: "value1"},
      ],
      backgroundColor: "",
      animationUrl: "",
      youtubeUrl: "",
      royaltyPercentage: 0,
      royaltyPaymentAddress: "",
    };

    const nft1 = {
      image: "image1",
      imageData: "",
      externalUrl: "",
      description: "",
      name: "nft #1",
      attributes: [
        {traitType: "type1", value: "value1"},
      ],
      backgroundColor: "",
      animationUrl: "",
      youtubeUrl: "",
      royaltyPercentage: 5,
      royaltyPaymentAddress: "",
    }

    let metadatas: Metadata[] = [nft0, nft1];

    const resp = await client.CalculateMerkleRoot({
      user: selectedWallet?.address,
      projectId: 1,
      networkId: networkId,
      metadatas
    })
    console.log(resp)
   }

  return (
    <View style={styles.container}>
      <RiotGameHeader hideMenu />

      <View style={styles.positionRelative}>
        <FlatList
          data={gameBgData}
          numColumns={10}
          extraData={{ width, height }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <GameBgCard
              width={cardSize.width}
              height={cardSize.height}
              hidePlus={index < 10}
              item={item}
            />
          )}
        />
        <CenterSection
          onPress={uploadMetadata}
          cardWidth={cardSize.width}
          cardHeight={cardSize.height}
        />
        <GameBgOverlay type="top" />
        <GameBgOverlay type="bottom" />
        <GameBgOverlay type="left" />
        <GameBgOverlay type="right" />
      </View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral00,
  },
  positionRelative: {
    flex: 1,
    position: "relative",
  },
});
