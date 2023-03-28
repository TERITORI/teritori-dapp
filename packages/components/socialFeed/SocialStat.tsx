import { ViewStyle, TouchableOpacity, View, StyleProp } from "react-native";

import { neutral22 } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export const socialStatHeight = 28;

export const SocialStat: React.FC<{
  label: string;
  emoji?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}> = ({ label, emoji, style, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={[
        {
          paddingRight: layout.padding_x1,
          paddingLeft: layout.padding_x0_5,
          height: socialStatHeight,
          backgroundColor: neutral22,
          borderRadius: 6,
          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
    >
      {emoji && (
        <View
          style={{
            marginRight: layout.padding_x0_5,
            width: 20,
            height: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BrandText style={fontSemibold13}>{emoji}</BrandText>
        </View>
      )}

      <BrandText style={fontSemibold13}>{label}</BrandText>
    </TouchableOpacity>
  );
};
