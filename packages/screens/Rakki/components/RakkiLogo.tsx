import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { IntroJapText } from "@/screens/Rakki/components/IntroJapText";

export const RakkiLogo: FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <View style={style}>
      <IntroJapText />
      <BrandText
        style={{
          textAlign: "center",
          fontSize: 96.667,
          lineHeight: 116 /* 120% */,
          letterSpacing: -3.867,
          fontWeight: "600",
        }}
      >
        RAKKi
      </BrandText>
      <IntroJapText />
    </View>
  );
};
