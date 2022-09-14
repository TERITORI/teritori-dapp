import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { prettyPrice } from "../../utils/coins";
import { Network } from "../../utils/network";
import { fontSemibold12, fontSemibold28 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { NetworkIcon } from "../NetworkIcon";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";

// TODO: Dynamic data + props

export const NFTPriceBuyCard: React.FC<{
  price?: string;
  priceDenom?: string;
  onPressBuy: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ price = "", priceDenom = "", onPressBuy, style }) => {
  return (
    <TertiaryBox
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
          {/*TODO: Text gradient pink*/}
          <BrandText
            style={[fontSemibold28, { color: "#DBAEFF", marginRight: 12 }]}
          >
            {prettyPrice(price, priceDenom)}
          </BrandText>
          <NetworkIcon network={Network.Teritori} circle size={24} />
        </View>
      </View>
      <PrimaryButton size="XL" text="Buy this NFT" onPress={onPressBuy} />
    </TertiaryBox>
  );
};
