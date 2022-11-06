import React, { useCallback, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import {
  getNativeCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
} from "../../networks";
import { NFTInfo } from "../../screens/Marketplace/NFTDetailScreen";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { NFTSellInfo } from "../nftDetails/components/NFTSellInfo";

export const NFTSellCard: React.FC<{
  onPressSell: (price: string, denom: string | undefined) => void;
  networkId?: string;
  style?: StyleProp<ViewStyle>;
  nftInfo?: NFTInfo;
}> = ({ onPressSell: onSell, style, networkId, nftInfo }) => {
  const [price, setPrice] = useState("");
  const currency = getNativeCurrency(networkId, nftInfo?.mintDenom);
  const handleSell = useCallback(
    () => onSell(price, nftInfo?.mintDenom),
    [onSell, price]
  );
  if (!currency) {
    return null;
  }
  return (
    <View style={style}>
      <TertiaryBox
        fullWidth
        height={88}
        style={{ marginBottom: 16 }}
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
      <NFTSellInfo nftInfo={nftInfo} networkId={networkId} price={price} />
    </View>
  );
};
