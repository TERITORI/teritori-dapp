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
import { Metadata, WhitelistMintInfo } from "@/api/launchpad/v1/launchpad";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";

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

  const updateWhitelists = async () => {
    let client = mustGetLauchpadClient(networkId);
    let whitelists: WhitelistMintInfo[] = [
      {
        addresses: ["address1"],
        unitPrice: 1_000_000,
        denom: 'utori',
        limitPerAddress: 2,
        addressesCount: 1,
        startTime: Date.now(),
        endTime: Date.now(),
      },
      {
        addresses: ["address2"],
        unitPrice: 2_000_000,
        denom: 'utori',
        limitPerAddress: 2,
        addressesCount: 1,
        startTime: Date.now(),
        endTime: Date.now(),
      }
    ]

    let res = await client.UpdateCollectionWhitelists({sender: selectedWallet?.address, networkId:  networkId, projectId: 1, whitelistMintInfos: whitelists})
    console.log(res)
  }

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

    const resp = await client.UpdateTokensMetadatas({
      sender: selectedWallet?.address,
      projectId: 1,
      networkId,
      metadatas
    })
    console.log(resp)
   }

   const getTokenMetadata = async () => {
    let client = mustGetLauchpadClient(networkId);
    const resp = await client.TokenMetadata({
      sender: selectedWallet?.address,
      projectId: 1,
      networkId,
      tokenId: 1,
    })
    console.log(resp)
   }

  return (
    <View style={styles.container}>
      <RiotGameHeader hideMenu />
     
   <PrimaryButton text="Update tokens metadatas"  onPress={uploadMetadata} />
   <PrimaryButton text="Get token metadata"  onPress={getTokenMetadata} />
   <PrimaryButton text="Update whitelists"  onPress={updateWhitelists} />

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
          onPress={gotoEnroll}
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
