import React, { ReactFragment } from "react";
import { ViewStyle, View } from "react-native";

import { neutral22, neutral33 } from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { TertiaryCard } from "../cards/TertiaryCard";

export const SocialButton: React.FC<{
  text: string;
  iconSvg: ReactFragment; // Ugly, but it works (Removing the fragments from parent and using the type 'Element' doesn't work)
  onPress?: () => void;
  style?: ViewStyle;
}> = ({ text, onPress, iconSvg, style }) => {
  return (
    <TertiaryCard onPress={onPress} style={style} backgroundColor={neutral22}>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <TertiaryCard
          backgroundColor={neutral33}
          width={32}
          height={32}
          squaresBackgroundColor={neutral22}
          borderRadius={6}
          cornerWidth={5}
        >
          {iconSvg}
        </TertiaryCard>
        <BrandText style={[fontMedium14, { marginLeft: 8, marginRight: 10 }]}>
          {text}
        </BrandText>
      </View>
    </TertiaryCard>
  );
};
