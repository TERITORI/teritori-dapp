import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { selectSelectedNetworkId } from "../../store/slices/settings";
import { prettyPrice } from "../../utils/coins";
import { fontSemibold12, fontSemibold28 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GradientText } from "../gradientText";
import { CurrencyIcon } from "../images/CurrencyIcon";

export const NFTCancelListingCard: React.FC<{
  price?: string;
  priceDenom?: string;
  onPressCancel: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ price = "", priceDenom = "", onPressCancel, style }) => {
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
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
          <GradientText
            gradientType="purple"
            style={[fontSemibold28, { marginRight: 12 }]}
          >
            {prettyPrice(selectedNetworkId, price, priceDenom)}
          </GradientText>
          <CurrencyIcon
            networkId={selectedNetworkId}
            denom={priceDenom}
            size={24}
          />
        </View>
      </View>
      <PrimaryButton
        size="XL"
        text="Cancel listing"
        loader
        onPress={onPressCancel}
      />
    </TertiaryBox>
  );
};
