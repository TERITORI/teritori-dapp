import React from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import AbstainSVG from "../../../../../assets/icons/abstain.svg";
import PassedSVG from "../../../../../assets/icons/passed-white.svg";
import RejectSVG from "../../../../../assets/icons/reject-white.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import {
  additionalRed,
  additionalSuccess,
  errorColor,
  neutral22,
  neutralA3,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const ValidatorVote: React.FC<{
  title: string;
  titleColor: string;
  iconSVG: React.FC<SvgProps>;
  backgroundColor: string;
}> = ({ title, titleColor, iconSVG, backgroundColor }) => {
  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 100,
        flexDirection: "row",
        alignItems: "center",
        padding: layout.spacing_x1,
        gap: layout.spacing_x1,
        height: 24,
        alignSelf: "flex-start",
      }}
    >
      <SVG source={iconSVG} width={16} height={16} />
      <BrandText style={[fontSemibold14, { color: titleColor }]}>
        {title}
      </BrandText>
    </View>
  );
};

export const ValidatorVoteView: React.FC<{
  title: string;
}> = ({ title }) => {
  switch (title) {
    case "Yes":
      return (
        <ValidatorVote
          title={title}
          backgroundColor={additionalSuccess}
          titleColor={secondaryColor}
          iconSVG={PassedSVG}
        />
      );
    case "No":
      return (
        <ValidatorVote
          title={title}
          backgroundColor={errorColor}
          titleColor={secondaryColor}
          iconSVG={RejectSVG}
        />
      );
    case "NoWithVeto":
      return (
        <ValidatorVote
          title={title}
          backgroundColor={additionalRed}
          titleColor={secondaryColor}
          iconSVG={RejectSVG}
        />
      );
    case "Abstain":
      return (
        <ValidatorVote
          title={title}
          backgroundColor={neutral22}
          titleColor={neutralA3}
          iconSVG={AbstainSVG}
        />
      );
    default:
      return <></>;
  }
};
