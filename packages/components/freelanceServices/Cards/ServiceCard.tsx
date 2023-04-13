import React from "react";
import {
  Image,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import dotsCircle from "../../../../assets/icons/dots-circle.svg";
import star from "../../../../assets/icons/yellow-star.svg";
import { GigData } from "../../../screens/FreelanceServices/types/fields";
import { ipfsPinataUrl } from "../../../utils/ipfs";
import { neutral77, yellowDefault } from "../../../utils/style/colors";
import {
  fontMedium10,
  fontSemibold12,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { Separator } from "../../Separator";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const ServiceCard: React.FC<{
  width: number;
  height: number;
  mainContainerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  gigData: GigData;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  height,
  mainContainerStyle,
  boxStyle,
  gigData,
}) => {
  return (
    <TertiaryBox
      width={width}
      height={height}
      mainContainerStyle={[mainContainerStyle]}
      style={[boxStyle]}
    >
      <Image
        source={gigData.sellerUser.backgroundPic}
        style={{ width: 274, height: 172 }}
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: 8,
          justifyContent: "space-between",
          width: 274,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: ipfsPinataUrl(gigData.sellerUser.profilePic) }}
            style={{ width: 32, height: 32, marginRight: 4 }}
          />
          <View style={{ flexDirection: "column" }}>
            <BrandText style={fontSemibold12}>
              @{gigData.sellerUser.username}
            </BrandText>
            <BrandText style={[fontMedium10, { color: neutral77 }]}>
              {gigData.sellerUser.levelText}
            </BrandText>
          </View>
        </View>
        <TouchableOpacity>
          <SVG source={dotsCircle} width={32} height={32} />
        </TouchableOpacity>
      </View>
      <BrandText
        style={[
          { color: neutral77, width: 274, marginTop: 12 },
          fontSemibold12,
        ]}
      >
        {gigData.title}
      </BrandText>
      <Separator style={{ width: 274, marginTop: 12 }} />

      <View
        style={{
          flexDirection: "row",
          width: 274,
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVG source={star} width={24} height={24} color={yellowDefault} />
          <BrandText style={[{ color: yellowDefault }, fontSemibold12]}>
            {gigData.sellerUser.rating}
          </BrandText>
        </View>

        <View style={{ flexDirection: "column" }}>
          <BrandText style={[{ color: neutral77 }, fontSemibold12]}>
            {gigData.pricePreText}
          </BrandText>
          <BrandText style={[fontSemibold14]}>
            {gigData.price.value} {gigData.price.currency}
          </BrandText>
        </View>
      </View>
    </TertiaryBox>
  );
};
