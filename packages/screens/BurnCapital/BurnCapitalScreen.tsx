import React, { useEffect } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useNFTBurnerTotal } from "@/hooks/nft-burner/useNFTBurnerTotal";
import { useNFTBurnerUserCount } from "@/hooks/nft-burner/useNFTBurnerUserCount";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature, getNetwork } from "@/networks";
import { BurnSideCart } from "@/screens/BurnCapital/components/BurnSideCart";
import { BurnableNFTs } from "@/screens/BurnCapital/components/BurnableNFTs";
import { TopSectionConnectWallet } from "@/screens/BurnCapital/components/TopSectionConnectWallet";
import { setSelectedNetworkId } from "@/store/slices/settings";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral00, neutral33 } from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const BurnCapitalScreen: ScreenFC<"BurnCapital"> = ({ route }) => {
  const inputNetwork = route.params?.network;
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const dispatch = useDispatch();
  const navigation = useAppNavigation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!inputNetwork) {
      return;
    }
    const network = getNetwork(inputNetwork);
    if (!network) {
      return;
    }
    dispatch(setSelectedNetworkId(network.id));
  }, [dispatch, inputNetwork]);

  const { data: count } = useNFTBurnerUserCount(selectedWallet?.userId);
  const { data: total } = useNFTBurnerTotal(selectedNetworkId);
  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      fullWidth
      forceNetworkFeatures={[NetworkFeature.CosmWasmNFTsBurner]}
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
          <TopSectionConnectWallet />
          {typeof total === "number" && (
            <BrandText>Total burned: {total}</BrandText>
          )}
          {typeof count === "number" && (
            <BrandText>Burned by you: {count}</BrandText>
          )}

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
