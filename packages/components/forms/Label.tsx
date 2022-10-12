import React from "react";
import { View } from "react-native";

import starRedSVG from "../../../assets/icons/star-red.svg";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

interface LabelProps {
  text: string;
  isRequired?: boolean;
}

export const Label: React.FC<LabelProps> = ({ text, isRequired }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
      }}
    >
      <BrandText
        style={{
          fontSize: 20,
        }}
      >
        {text}
      </BrandText>
      {!!isRequired && (
        <SVG
          source={starRedSVG}
          width={9}
          style={{
            marginLeft: 4,
            marginTop: 4,
          }}
        />
      )}
    </View>
  );
};
