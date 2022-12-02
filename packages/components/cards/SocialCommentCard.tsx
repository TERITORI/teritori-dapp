import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useMaxResolution } from "../../hooks/useMaxResolution";
import { neutralA3 } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold16 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { PrimaryBox } from "../boxes/PrimaryBox";
import { AvatarWithFrame } from "../images/AvatarWithFrame";

export const SocialCommentCard: React.FC<{
  comment: object;
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const imageMarginRight = layout.padding_x3_5;
  const tertiaryBoxPaddingHorizontal = layout.padding_x3;

  const { width: containerWidth } = useMaxResolution({
    responsive: true,
  });

  return (
    <PrimaryBox
      mainContainerStyle={[
        {
          paddingVertical: layout.padding_x3,
          paddingHorizontal: tertiaryBoxPaddingHorizontal,
          borderRadius: 12,
          marginVertical: 0.5,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row" }}>
        <AvatarWithFrame
          image={null}
          style={{
            marginRight: imageMarginRight,
          }}
          size={49}
        />
        <View style={{ width: containerWidth - 240 }}>
          <BrandText style={fontSemibold16}>GNOPUNKS</BrandText>
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            Cannot wait to meet all of you folks! It’s amazing to see how this
            project is gathering from all cultures, networks, tribes and a huge
            borders breakers! FREE WEB, LET’S BUILD TOGETHER! #LBT
          </BrandText>
        </View>
      </View>
    </PrimaryBox>
  );
};
