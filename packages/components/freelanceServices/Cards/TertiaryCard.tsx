import React from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  ImageBackground,
  ImageSourcePropType,
  Image,
  TextStyle,
} from "react-native";

import { neutralA3, neutral17 } from "../../../utils/style/colors";
import { fontSemibold16, fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const TertiaryCard: React.FC<{
  width: number;
  height?: number;
  mainContainerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  firstTitle?: string;
  secondTitle?: string;
  imageBackground: ImageSourcePropType;
  profilePic?: ImageSourcePropType;
  firstTitleStyle?: TextStyle;
  descriptionTitle?: string;
  descriptionList?: string[];
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  height,
  mainContainerStyle,
  boxStyle,
  firstTitle,
  secondTitle,
  imageBackground,
  profilePic,
  firstTitleStyle,
  descriptionTitle,
  descriptionList,
}) => {
  return (
    <View style={{ flexDirection: "column" }}>
      <TertiaryBox
        width={width}
        height={height}
        mainContainerStyle={[
          { backgroundColor: neutral17 },
          mainContainerStyle,
        ]}
        style={boxStyle}
      >
        <ImageBackground
          source={imageBackground}
          style={{
            width: width - 1,
            height,
            aspectRatio: 4,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              height,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "flex-start",
                width: width - 30,
                marginTop: layout.padding_x2,
                marginLeft: layout.padding_x2,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {profilePic && (
                  <Image
                    source={profilePic}
                    style={{
                      width: 32,
                      height: 32,
                      marginRight: layout.padding_x1_5,
                    }}
                  />
                )}
                <BrandText style={[fontMedium14, firstTitleStyle]}>
                  {firstTitle}
                </BrandText>
              </View>
              <BrandText
                style={[fontSemibold16, { marginTop: layout.padding_x0_5 }]}
              >
                {secondTitle}
              </BrandText>
            </View>
          </View>
        </ImageBackground>
      </TertiaryBox>
      <View>
        <BrandText style={[fontSemibold16, { marginTop: 16 }]}>
          {descriptionTitle}
        </BrandText>
        {descriptionList?.map((item, index) => (
          <BrandText
            style={[{ color: neutralA3, marginTop: 12 }, fontMedium14]}
            key={index}
          >
            {item}
          </BrandText>
        ))}
      </View>
    </View>
  );
};
