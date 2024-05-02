import React, { FC } from "react";
import { TouchableOpacity, Image, StyleProp, ViewStyle } from "react-native";

import { secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { PrimaryBox } from "../../boxes/PrimaryBox";

export const fileItemPreviewWidth = 100;
export const ItemView: FC<{
  label: number;
  uri: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ label, uri, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[
        {
          height: 123,
          width: fileItemPreviewWidth,
          justifyContent: "flex-end",
          alignItems: "center",
          marginHorizontal: layout.spacing_x1,
        },
        style,
      ]}
      onPress={onPress}
    >
      <PrimaryBox
        style={{
          height: 100,
          width: 100,
        }}
      >
        <Image
          source={{ uri }}
          style={{
            height: 98,
            width: 98,
            borderRadius: 8,
          }}
        />
      </PrimaryBox>

      <PrimaryBox
        style={{
          borderRadius: 32,
          height: 34,
          width: 52,
          top: 0,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
        }}
      >
        <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
          {label}
        </BrandText>
      </PrimaryBox>
    </TouchableOpacity>
  );
};
