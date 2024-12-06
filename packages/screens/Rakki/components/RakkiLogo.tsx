import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { JapaneseText } from "@/screens/Rakki/components/JapaneseText";

export const RakkiLogo: FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <View style={style}>
      <JapaneseText />
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
      <JapaneseText />
    </View>
  );
};
