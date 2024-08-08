import React, { FC } from "react";
import { TouchableOpacity, Image, StyleProp, ViewStyle } from "react-native";

import { neutral77, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold11, fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { PrimaryBox } from "../../boxes/PrimaryBox";

export const itemSize = 120;
export const ItemView: FC<{
  label: string;
  subLabel?: string;
  uri: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ label, subLabel, uri, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[
        {
          height: itemSize,
          width: itemSize,
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
          height: itemSize,
          width: itemSize,
        }}
      >
        <Image
          source={{ uri }}
          style={{
            height: itemSize - 2,
            width: itemSize - 2,
            borderRadius: 8,
          }}
        />
      </PrimaryBox>

      <PrimaryBox
        style={{
          // borderRadius: 32,
          paddingHorizontal: layout.spacing_x1,
          paddingVertical: layout.spacing_x0_5,
          // height: 34,
          width: itemSize - 10,
          bottom: -20,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
        }}
      >
        <BrandText
          style={[fontSemibold13, { color: secondaryColor }]}
          numberOfLines={1}
        >
          {label}
        </BrandText>
        {subLabel && (
          <BrandText
            style={[fontSemibold11, { color: neutral77 }]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {subLabel}
          </BrandText>
        )}
      </PrimaryBox>
    </TouchableOpacity>
  );
};
