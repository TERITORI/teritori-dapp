import { Pressable, ViewStyle } from "react-native";

import { neutral22 } from "../utils/style/colors";
import { fontSemibold13 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";

export const SocialStat: React.FC<{
  label: string;
  emoji: string;
  style?: ViewStyle;
}> = ({ label, emoji, style }) => {
  return (
    <Pressable
      style={[
        {
          paddingRight: layout.padding_x1,
          paddingTop: layout.padding_x0_5,
          paddingHorizontal: layout.padding_x0_5,
          height: 28,
          backgroundColor: neutral22,
          borderRadius: 6,
          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
    >
      <BrandText style={[fontSemibold13, { marginRight: layout.padding_x0_5 }]}>
        {emoji}
      </BrandText>
      <BrandText style={fontSemibold13}>{label}</BrandText>
    </Pressable>
  );
};
