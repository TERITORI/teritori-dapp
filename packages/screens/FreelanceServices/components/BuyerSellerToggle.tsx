import React, { FC } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral33,
  primaryColor,
  primaryTextColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

//TODO: Maybe we can make a reusable component for this. The same design is used at other places (Like NftTypeTabe.tsx),
// but with another styles

export const BuyerSellerToggle: FC<{
  isBuyer?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ isBuyer = true, style }) => {
  const navigation = useAppNavigation();
  return (
    <View style={[{ flexDirection: "row" }, style]}>
      <TouchableOpacity
        style={[
          {
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            borderColor: neutral33,
            borderWidth: 1,
            paddingHorizontal: layout.padding_x2,
            borderRightWidth: 0,
            alignItems: "center",
            justifyContent: "center",
            height: 32,
          },
          isBuyer && {
            backgroundColor: primaryColor,
          },
        ]}
        onPress={() => {
          navigation.navigate("FreelanceServicesHomeBuyer");
        }}
      >
        {/*<TouchableOpacity*/}
        {/*  onPress={() => {*/}
        {/*    navigation.navigate("FreelanceServicesHomeBuyer");*/}
        {/*  }}*/}
        {/*>*/}
        <BrandText
          style={[
            fontSemibold14,
            isBuyer && {
              color: primaryTextColor,
            },
          ]}
        >
          I'm a Buyer
        </BrandText>
        {/*</TouchableOpacity>*/}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          {
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            borderColor: neutral33,
            paddingHorizontal: layout.padding_x2,
            borderWidth: 1,
            borderLeftWidth: 0,
            alignItems: "center",
            justifyContent: "center",
            height: 32,
          },
          !isBuyer && {
            backgroundColor: primaryColor,
          },
        ]}
        onPress={() => {
          navigation.navigate("FreelanceServicesHomeSeller");
        }}
      >
        {/*<TouchableOpacity*/}
        {/*  onPress={() => {*/}
        {/*    navigation.navigate("FreelanceServicesHomeSeller");*/}
        {/*  }}*/}
        {/*>*/}
        <BrandText
          style={[fontSemibold14, !isBuyer && { color: primaryTextColor }]}
        >
          I'm a Seller
        </BrandText>
        {/*</TouchableOpacity>*/}
      </TouchableOpacity>
    </View>
  );
};
