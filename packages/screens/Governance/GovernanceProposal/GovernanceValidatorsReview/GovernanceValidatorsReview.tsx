import React from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import {
  neutral22,
  neutral77,
  primaryColor,
  secondaryColor,
} from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const GovernanceValidatorsReview: React.FC<{
  validator: number;
}> = ({ validator = 0 }) => {
  return (
    <>
      <BrandText
        style={[
          fontSemibold20,
          {
            color: secondaryColor,
          },
        ]}
      >
        Validator’s Review
      </BrandText>
      <SpacerColumn size={2} />
      <BrandText
        style={[
          fontSemibold14,
          {
            color: secondaryColor,
          },
        ]}
      >
        My Validators{" "}
        <BrandText
          style={[
            fontSemibold14,
            {
              color: primaryColor,
            },
          ]}
        >
          {validator}
        </BrandText>
      </BrandText>

      <SpacerColumn size={2} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: layout.spacing_x0_5,
          borderRadius: layout.spacing_x0_75,
          borderWidth: 1,
          height: 56,
          borderColor: neutral22,
          width: 1290,
        }}
      >
        <BrandText
          style={[
            fontSemibold13,
            {
              color: neutral77,
            },
          ]}
        >
          There are no validators votes/reviews yet.
        </BrandText>
      </View>
    </>
  );
};
