import React from "react";
import { useForm } from "react-hook-form";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { prettyPrice } from "../../utils/coins";
import { neutral17, neutral33, secondaryColor } from "../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold14,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { NFTInfo } from "../../utils/types/nft";
import { BrandText } from "../BrandText";
import { CurrencyIcon } from "../CurrencyIcon";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";
import { GradientText } from "../gradientText";
import { TextInputCustom } from "../inputs/TextInputCustom";
import { SpacerRow } from "../spacer";

export type NFTModifyListingForm = {
  newPrice: string;
};

export const NFTModifyListingCard: React.FC<{
  nftInfo: NFTInfo;
  onPressCancel: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ nftInfo, onPressCancel, style }) => {
  const { control, watch } = useForm<NFTModifyListingForm>();
  const newPrice = watch("newPrice");

  return (
    <LegacyTertiaryBox
      fullWidth
      height={100}
      style={style}
      mainContainerStyle={{
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1 }}>
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

      <SpacerRow size={1} />

      <View
        style={{
          justifyContent: "space-between",
          height: "100%",
          flex: 1,
          maxWidth: 200,
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <TextInputCustom
            label=""
            name="newPrice"
            placeHolder="New Price"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            textInputStyle={{
              width: "100%",
              minHeight: 28,
              height: 28,
              maxHeight: 28,
              borderWidth: 1,
              borderColor: neutral33,
              backgroundColor: neutral17,
              borderRadius: 4,
              padding: layout.spacing_x1,
            }}
            variant="noStyle"
            height={28}
            noBrokenCorners
          />
          <SpacerRow size={1} />

          <TouchableOpacity
            style={{
              backgroundColor: neutral33,
              height: 28,
              width: 28,
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              // TODO : Modify listing price
            }}
            disabled={!newPrice}
          >
            <BrandText
              style={[
                fontSemibold14,
                {
                  color: secondaryColor,
                },
              ]}
            >
              OK
            </BrandText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: neutral33,
            height: 28,
            borderRadius: 4,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={onPressCancel}
        >
          <BrandText
            style={[
              fontSemibold14,
              {
                color: secondaryColor,
              },
            ]}
          >
            Cancel listing
          </BrandText>
        </TouchableOpacity>
      </View>
    </LegacyTertiaryBox>
  );
};
