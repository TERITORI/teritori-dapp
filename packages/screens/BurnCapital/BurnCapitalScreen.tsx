import React, { useState } from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Tabs } from "@/components/tabs/Tabs";
import { useNFTBurnerTotal } from "@/hooks/nft-burner/useNFTBurnerTotal";
import { useNFTBurnerUserCount } from "@/hooks/nft-burner/useNFTBurnerUserCount";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { teritoriNetwork } from "@/networks/teritori";
import { BurnSideCart } from "@/screens/BurnCapital/components/BurnSideCart";
import { BurnableNFTs } from "@/screens/BurnCapital/components/BurnableNFTs";
import { TopSectionConnectWallet } from "@/screens/BurnCapital/components/TopSectionConnectWallet";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral00, neutral33 } from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const tabs = {
  burn: {
    name: "Burn NFTs",
  },
  leaderboard: {
    name: "Leaderboard",
  },
};

export const BurnCapitalScreen: ScreenFC<"BurnCapital"> = ({ route }) => {
  const inputNetwork = route.params?.network || teritoriNetwork.id;
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const isMobile = useIsMobile();

  const [selectedTab, setSelectedTab] = useState<"burn" | "leaderboard">(
    "burn",
  );

  const { data: count } = useNFTBurnerUserCount(selectedWallet?.userId);
  const { data: total } = useNFTBurnerTotal(selectedNetworkId);
  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      fullWidth
      forceNetworkId={inputNetwork}
      headerChildren={
        <BrandText style={fontSemibold20}>BURN Capital 🔥</BrandText>
      }
      responsive
      onBackPress={() => navigation.navigate("Marketplace")}
    >
      <View
        style={{
          marginTop: layout.spacing_x4,
        }}
      >
        <View
          style={{
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tabs
            items={tabs}
            selected={selectedTab}
            style={{ height: 48 }}
            onSelect={setSelectedTab}
          />

          <TopSectionConnectWallet />
          {typeof total === "number" && (
            <BrandText>Total burned: {total}</BrandText>
          )}
          {typeof count === "number" && (
            <BrandText>Burned by you: {count}</BrandText>
          )}
          {/*{nftCollectionToBurn.map((nft) => (*/}
          {/*  <CollectionContent*/}
          {/*    key={nft.id}*/}
          {/*    id={nft.id}*/}
          {/*    selectedTab="owned"*/}
          {/*    sortDirection={1}*/}
          {/*    style={{ marginHorizontal: layout.spacing_x3 }}*/}
          {/*  />*/}
          {/*))}*/}

          <BurnableNFTs
            ownerId={selectedWallet?.userId || ""}
            style={{ marginHorizontal: layout.spacing_x3 }}
          />
          <BurnSideCart
            style={{
              position: isMobile ? "relative" : "absolute",
              right: isMobile ? 0 : 50,
              top: isMobile ? 0 : 500,
              marginTop: layout.spacing_x4,
              flexDirection: "column",
              width: 245,
              marginBottom: layout.spacing_x2_5,
              backgroundColor: neutral00,
              borderRadius: layout.spacing_x2,
              borderColor: neutral33,
              borderWidth: 1,
              paddingVertical: layout.spacing_x1,
              paddingHorizontal: layout.spacing_x1_5,
              borderStyle: "solid",
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
