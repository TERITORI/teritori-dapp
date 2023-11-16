import React from "react";
import { ImageBackground, StyleProp, View, ViewStyle } from "react-native";

import { useDynamicPngImport } from "../../../hooks/freelance/useDynamicPngImport";
import { neutral17 } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { TertiaryBox } from "../../boxes/TertiaryBox";

type CutOffCardProps = {
  title?: string;
  subtitle?: string;
  imageBackground: string;
  width: number;
  height?: number;
  mainContainerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
};

export const CutOffCard: React.FC<CutOffCardProps> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  height,
  mainContainerStyle,
  boxStyle,
  title,
  imageBackground,
}) => {
  const { PngComponent } = useDynamicPngImport(imageBackground);

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
        {PngComponent && (
          <ImageBackground
            source={PngComponent!}
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
                  marginTop: layout.spacing_x2,
                  marginLeft: layout.spacing_x2,
                }}
              >
                <BrandText
                  style={[fontSemibold16, { marginTop: layout.spacing_x0_5 }]}
                >
                  {title}
                </BrandText>
              </View>
            </View>
          </ImageBackground>
        )}
      </TertiaryBox>
    </View>
  );
};
