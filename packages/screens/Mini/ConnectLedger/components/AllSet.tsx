import React from "react";
import { View } from "react-native";

import { CustomButton } from "../../components/Button/CustomButton";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium16, fontSemibold30 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = {
  onComplete: () => void;
  description?: string;
};

export const AllSet = ({ onComplete, description }: Props) => {
  const onPressStart = () => {
    onComplete();
  };
  return (
    <View style={{ flex: 1, paddingHorizontal: layout.spacing_x2 }}>
      <SpacerColumn size={8} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x0_5,
        }}
      >
        <BrandText
          style={[
            fontSemibold30,
            {
              lineHeight: 36,
              marginBottom: layout.spacing_x1_5,
            },
          ]}
        >
          You're All Set!
        </BrandText>
        <BrandText
          style={[
            fontMedium16,
            {
              color: neutral77,
              lineHeight: 22,
            },
          ]}
        >
          {description}
        </BrandText>
      </View>

      <CustomButton title="Start" onPress={onPressStart} />
    </View>
  );
};
