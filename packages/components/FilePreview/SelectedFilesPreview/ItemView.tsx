import React from "react";
import { TouchableOpacity, Image } from "react-native";

import { secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { PrimaryBox } from "../../boxes/PrimaryBox";

export const ItemView = ({
  label,
  uri,
  onPress,
}: {
  label: number;
  uri: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        height: 123,
        width: 100,
        justifyContent: "flex-end",
        alignItems: "center",
        marginHorizontal: layout.spacing_x1,
      }}
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
