import React, { useCallback, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";

import {
  getNativeCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
} from "../../networks";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";

export const NFTSellCard: React.FC<{
  onPressSell: (price: string, denom: string | undefined) => void;
  networkId?: string;
  denom?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ onPressSell: onSell, style, networkId, denom }) => {
  const [price, setPrice] = useState("");
  const currency = getNativeCurrency(networkId, denom);
  const handleSell = useCallback(() => onSell(price, denom), [onSell, price]);
  if (!currency) {
    return null;
  }
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
      <TextInputCustom<{ price: string }>
        name="price"
        label={`Price in ${currency.displayName}`}
        value={price}
        currency={keplrCurrencyFromNativeCurrencyInfo(currency)}
        placeHolder=""
        onChangeText={setPrice}
        width={322}
      />
      <PrimaryButton
        loader
        size="XL"
        text="List this NFT"
        onPress={handleSell}
      />
    </TertiaryBox>
  );
};
