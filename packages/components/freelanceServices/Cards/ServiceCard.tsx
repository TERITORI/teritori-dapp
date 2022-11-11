import React from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  ImageSourcePropType,
  Image,
} from "react-native";

import dotsCircle from "../../../../assets/icons/dots-circle.svg";
import star from "../../../../assets/icons/yellow-star.svg";
import { yellowDefault, neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontMedium10,
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
  backgroundPic: ImageSourcePropType;
  profilePic: ImageSourcePropType;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  height,
  mainContainerStyle,
  boxStyle,
  backgroundPic,
  profilePic,
}) => {
  return (
    <TertiaryBox
      width={width}
      height={height}
      mainContainerStyle={[mainContainerStyle]}
      style={[boxStyle]}
    >
      <Image source={backgroundPic} style={{ width: 274, height: 172 }} />
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
            source={profilePic}
            style={{ width: 32, height: 32, marginRight: 4 }}
          />
          <View style={{ flexDirection: "column" }}>
            <BrandText style={fontSemibold12}>@username</BrandText>
            <BrandText style={[fontMedium10, { color: neutral77 }]}>
              level 2 seller
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
        I will do modern time fnzeless logo design with copyrights
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
            4,9
          </BrandText>
        </View>

        <View style={{ flexDirection: "column" }}>
          <BrandText style={[{ color: neutral77 }, fontSemibold12]}>
            Starting at
          </BrandText>
          <BrandText style={[fontSemibold14]}>50,0 TORI</BrandText>
        </View>
      </View>
    </TertiaryBox>
  );
};
