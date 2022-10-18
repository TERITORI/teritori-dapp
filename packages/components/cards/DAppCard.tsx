import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

import dappCardSVG from "../../../assets/cards/dapp-card.svg";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

const gridHalfGutter = 12;

export const DAppCard: React.FC<{
  label: string;
  description: string;
  info: string;
  onPress?: () => void;
  iconSVG: React.FC<SvgProps>;
}> = ({ label, description, info, onPress, iconSVG }) => {
  const labelFontSize = 20;
  const descriptionFontSize = 14;
  const borderRadius = 20;
  const width = 344;
  const height = 164;
  return (
    <TouchableOpacity style={{ margin: gridHalfGutter }} onPress={onPress}>
      <SVG
        width={width}
        height={height}
        source={dappCardSVG}
        style={{ position: "absolute" }}
      />
      <View
        style={{
          width,
          height,
          flexDirection: "row",
          justifyContent: "flex-start",
          borderRadius,
          alignItems: "center",
        }}
      >
        <SVG
          width={40}
          height={40}
          source={iconSVG}
          style={{ marginLeft: 68, position: "absolute" }}
        />
        <View
          style={{
            width,
            height,
            flexDirection: "row",
            justifyContent: "flex-start",
            borderRadius,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flex: 1,
              paddingTop: 16,
              paddingRight: 20,
              paddingBottom: 18,
              paddingLeft: 144,
              height,
            }}
          >
            <BrandText
              style={{
                color: "white",
                fontSize: labelFontSize,
                letterSpacing: -(labelFontSize * 0.04),
              }}
            >
              {label}
            </BrandText>
            <View>
              <BrandText
                style={{
                  color: "#A3A3A3",
                  fontSize: descriptionFontSize,
                  fontWeight: "500",
                  letterSpacing: -(descriptionFontSize * 0.04),
                }}
              >
                {description}
              </BrandText>
            </View>
            <BrandText style={{ color: "#777777", fontSize: 13 }}>
              {info}
            </BrandText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
