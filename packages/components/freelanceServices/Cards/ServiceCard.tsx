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
import { ServiceFields } from "../../../screens/FreelanceServices/types/fields";
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
  data: ServiceFields;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  height,
  mainContainerStyle,
  boxStyle,
  data,
}) => {
  return (
    <TertiaryBox
      width={width}
      height={height}
      mainContainerStyle={[mainContainerStyle]}
      style={[boxStyle]}
    >
      <Image
        source={data.user.backgroundPic}
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
            source={data.user.profilePic}
            style={{ width: 32, height: 32, marginRight: 4 }}
          />
          <View style={{ flexDirection: "column" }}>
            <BrandText style={fontSemibold12}>@{data.user.username}</BrandText>
            <BrandText style={[fontMedium10, { color: neutral77 }]}>
              {data.user.description}
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
        {data.description}
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
            {data.user.rating}
          </BrandText>
        </View>

        <View style={{ flexDirection: "column" }}>
          <BrandText style={[{ color: neutral77 }, fontSemibold12]}>
            {data.pricePreText}
          </BrandText>
          <BrandText style={[fontSemibold14]}>
            {data.price.value} {data.price.currency}
          </BrandText>
        </View>
      </View>
    </TertiaryBox>
  );
};
