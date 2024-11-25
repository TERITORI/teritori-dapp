import React, { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleProp, View, ViewStyle } from "react-native";

import {
  getNativeCurrency,
  keplrCurrencyFromNativeCurrencyInfo,
} from "../../networks";
import { NFTInfo } from "../../utils/types/nft";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { NFTSellInfo } from "../nftDetails/components/NFTSellInfo";

interface SellNFTForm {
  price: string;
}

export const NFTSellCard: React.FC<{
  onPressSell: (price: string, denom: string | undefined) => void;
  style?: StyleProp<ViewStyle>;
  nftInfo?: NFTInfo;
}> = ({ onPressSell: onSell, style, nftInfo }) => {
  const { control, handleSubmit, watch } = useForm<SellNFTForm>();
  const values = watch();
  const currency = getNativeCurrency(nftInfo?.networkId, nftInfo?.mintDenom);
  const handleSell: SubmitHandler<SellNFTForm> = useCallback(
    (formValues) => onSell(formValues.price, nftInfo?.mintDenom),
    [onSell, nftInfo?.mintDenom],
  );
  if (!currency) {
    return null;
  }
  return (
    <View style={style}>
      <LegacyTertiaryBox
        fullWidth
        height={88}
        style={{ marginBottom: 16 }}
        mainContainerStyle={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextInputCustom<SellNFTForm>
          name="price"
          control={control}
          label={`Price in ${currency.displayName}`}
          currency={keplrCurrencyFromNativeCurrencyInfo(currency)}
          placeHolder="0"
          rules={{ required: true }}
          width={250}
        />
        <PrimaryButton
          loader
          size="XL"
          text="List this NFT"
          onPress={handleSubmit(handleSell)}
        />
      </LegacyTertiaryBox>
      <NFTSellInfo nftInfo={nftInfo} price={values.price} />
    </View>
  );
};
