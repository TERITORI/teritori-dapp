import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useIsMobile } from "../../hooks/useIsMobile";
import { prettyPrice } from "../../utils/coins";
import { fontSemibold12, fontSemibold28 } from "../../utils/style/fonts";
import { NFTInfo } from "../../utils/types/nft";
import { BrandText } from "../BrandText";
import { CurrencyIcon } from "../CurrencyIcon";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GradientText } from "../gradientText";

// TODO: Dynamic data + props

export const NFTPriceBuyCard: React.FC<{
  nftInfo: NFTInfo;
  onPressBuy: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ nftInfo, onPressBuy, style }) => {
  const isMobile = useIsMobile();

  return (
    <LegacyTertiaryBox
      fullWidth
      height={88}
      style={style}
      mainContainerStyle={{
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        <BrandText style={[fontSemibold12, { marginBottom: 6 }]}>
          Current Price
        </BrandText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <GradientText
            gradientType="purple"
            style={[fontSemibold28, { marginRight: 12 }]}
          >
            {prettyPrice(nftInfo.networkId, nftInfo.price, nftInfo.priceDenom)}
          </GradientText>
          <CurrencyIcon
            networkId={nftInfo.networkId}
            denom={nftInfo.priceDenom}
            size={24}
          />
        </View>
      </View>
      <PrimaryButton
        size={isMobile ? "M" : "XL"}
        text="Buy this NFT"
        onPress={onPressBuy}
      />
    </LegacyTertiaryBox>
  );
};
