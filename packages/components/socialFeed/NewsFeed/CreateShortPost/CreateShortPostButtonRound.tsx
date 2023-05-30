import React from "react";
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  useWindowDimensions,
} from "react-native";

import penSVG from "../../../../../assets/icons/pen.svg";
import {
  neutral17,
  neutral33,
  secondaryColor,
} from "../../../../utils/style/colors";
import { RESPONSIVE_BREAKPOINT_S } from "../../../../utils/style/layout";
import { SVG } from "../../../SVG";
import { ROUND_BUTTON_WIDTH_L, ROUND_BUTTON_WIDTH_S } from "../NewsFeed";

export const CreateShortPostButtonRound: React.FC<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onPress, style }) => {
  const { width } = useWindowDimensions();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width:
            width < RESPONSIVE_BREAKPOINT_S
              ? ROUND_BUTTON_WIDTH_S
              : ROUND_BUTTON_WIDTH_L,
          height:
            width < RESPONSIVE_BREAKPOINT_S
              ? ROUND_BUTTON_WIDTH_S
              : ROUND_BUTTON_WIDTH_L,
          backgroundColor: neutral17,
          borderColor: neutral33,
          borderWidth: 1,
          borderRadius: 999,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <SVG height={24} width={24} source={penSVG} color={secondaryColor} />
    </TouchableOpacity>
  );
};
