import React, { useCallback, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";

export const NFTSellCard: React.FC<{
  onPressSell: (price: string) => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onPressSell: onSell, style }) => {
  const [price, setPrice] = useState("");
  const handleSell = useCallback(() => onSell(price), [onSell, price]);
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
        label="Price in TORI"
        value={price}
        placeHolder=""
        onChangeText={setPrice}
        width={322}
      />
      <PrimaryButton size="XL" text="List this NFT" onPress={handleSell} />
    </TertiaryBox>
  );
};
