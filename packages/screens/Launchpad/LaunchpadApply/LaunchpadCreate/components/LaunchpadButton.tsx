import React from "react";
import { View } from "react-native";

import ChevronRightSvg from "@/assets/icons/chevron-right.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import {
  neutral17,
  neutral22,
  neutral77,
  primaryColor,
} from "@/utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export interface LaunchpadButtonProps {
  buttonTitle: string;
  title: string;
  description: string;
}

export const LaunchpadButton: React.FC<LaunchpadButtonProps> = ({
  title,
  description,
  buttonTitle,
}) => {
  return (
    <TertiaryBox
      style={{
        minHeight: 156,
        minWidth: 240,
        flexDirection: "row",
        padding: layout.spacing_x2,
        alignItems: "flex-start",
        backgroundColor: neutral17,
      }}
    >
      <View
        style={{
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <BrandText>{title}</BrandText>
        <SpacerColumn size={3} />
        <BrandText
          style={[
            fontSemibold12,
            {
              color: neutral77,
              width: 200,
              flexWrap: "wrap",
            },
          ]}
        >
          {description}
        </BrandText>
      </View>
      <View
        style={{
          alignSelf: "flex-end",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          flex: 1,
        }}
      >
        <BrandText
          style={[
            fontSemibold14,
            {
              color: primaryColor,
            },
          ]}
        >
          {buttonTitle}
        </BrandText>
        <SpacerRow size={2.5} />
        <View
          style={{
            width: layout.iconButton,
            height: layout.iconButton,
            borderRadius: 999,
            backgroundColor: neutral22,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SVG
            source={ChevronRightSvg}
            height={16}
            width={16}
            color={primaryColor}
          />
        </View>
      </View>
    </TertiaryBox>
  );
};
