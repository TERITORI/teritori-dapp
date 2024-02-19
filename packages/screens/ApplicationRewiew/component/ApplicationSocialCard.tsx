import React from "react";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SecondaryBox } from "@/components/boxes/SecondaryBox";
import { neutral22, neutral33 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";

export const ApplicationSocialCard: React.FC<{ socialData: any }> = ({
  socialData,
}) => {
  return (
    <SecondaryBox
      style={{
        borderRadius: 6,
        padding: 6,
        backgroundColor: neutral22,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <SecondaryBox
        style={{
          borderRadius: 6,
          backgroundColor: neutral33,
          padding: 8,
        }}
      >
        <SVG width={22} height={22} source={socialData?.icon} color="white" />
      </SecondaryBox>
      <BrandText style={[fontSemibold14, { marginStart: 8, marginEnd: 16 }]}>
        {socialData?.name}
      </BrandText>
    </SecondaryBox>
  );
};
