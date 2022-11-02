import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { prettyPrice } from "../../utils/coins";
import { fontSemibold12, fontSemibold28 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { CurrencyIcon } from "../CurrencyIcon";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const NFTCancelListingCard: React.FC<{
  price?: string;
  priceDenom?: string;
  onPressCancel: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ price = "", priceDenom = "", onPressCancel, style }) => {
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
            {prettyPrice(
              process.env.TERITORI_NETWORK_ID || "",
              price,
              priceDenom
            )}
          </BrandText>
          <CurrencyIcon
            networkId={process.env.TERITORI_NETWORK_ID || ""}
            denom={priceDenom}
            size={24}
          />
        </View>
      </View>
      <PrimaryButton size="XL" text="Cancel listing" onPress={onPressCancel} />
    </TertiaryBox>
  );
};
