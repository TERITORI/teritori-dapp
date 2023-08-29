import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { neutral17, neutral77 } from "../../../utils/style/colors";
import { fontSemibold9 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { TransparentButtonOutline } from "../../buttons/TransparentButtonOutline";

interface ConnectWalletButtonProps {
  icon: React.FC<SvgProps>;
  text: string;
  isComingSoon?: boolean;
  onPress?: () => void;
  iconSize?: number;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  isComingSoon,
  text,
  icon,
  onPress,
  iconSize = 24,
}) => {
  return (
    <TransparentButtonOutline
      fullWidth
      size="M"
      iconSVG={icon}
      text={text}
      onPress={onPress}
      disabled={isComingSoon}
      iconSize={iconSize}
      RightComponent={
        isComingSoon
          ? () => (
              <View style={comingsoonContainerStyle}>
                <BrandText style={soonTextStyle}>COMING SOON</BrandText>
              </View>
            )
          : undefined
      }
    />
  );
};

const comingsoonContainerStyle: ViewStyle = {
  padding: layout.padding_x0_5,
  borderRadius: 5,
  backgroundColor: neutral17,
  flex: 1,
};
const soonTextStyle: TextStyle = {
  ...fontSemibold9,
  color: neutral77,
};
