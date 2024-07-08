import React from "react";
import { TouchableOpacity, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { CurrencyInfo, getNativeCurrency } from "@/networks";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const SelectableCurrencySmall: React.FC<{
  onPressItem: () => void;
  currency: CurrencyInfo;
  networkId: string;
}> = ({ onPressItem, currency, networkId }) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPressItem}
        style={{
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CurrencyIcon
            size={28}
            denom={currency.denom}
            networkId={networkId}
          />
          <View style={{ marginLeft: layout.spacing_x1 }}>
            <BrandText style={fontSemibold14}>
              {getNativeCurrency(networkId, currency?.denom)?.displayName}
            </BrandText>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
