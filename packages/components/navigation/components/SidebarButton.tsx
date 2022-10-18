import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { useSidebar } from "../../../context/SidebarProvider";
import {
  neutral33,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SpacerRow } from "../../spacer";
import { SideNotch } from "./SideNotch";

interface SidebarButtonProps {
  iconSVG: React.FC<SvgProps>;
  selected?: boolean;
  onPress?: () => void;
  title?: string;
  iconSize?: number;
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({
  selected,
  iconSVG,
  onPress,
  title,
  iconSize = 28,
}) => {
  // variables
  const { isSidebarExpanded } = useSidebar();

  // animations
  const opacityStyle = useAnimatedStyle(
    () => ({
      opacity: isSidebarExpanded ? withSpring(1) : withSpring(0),
    }),
    [isSidebarExpanded]
  );

  // returns
  return (
    <Pressable onPress={onPress} disabled={selected} style={styles.container}>
      {selected && <SideNotch />}
      <View
        style={[styles.svgContainer, selected && { borderColor: primaryColor }]}
      >
        <SVG width={iconSize} height={iconSize} source={iconSVG} />
      </View>
      <SpacerRow size={2} />
      <Animated.View style={opacityStyle}>
        <BrandText style={[fontSemibold12, selected && { color: neutral77 }]}>
          {title}
        </BrandText>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.padding_x2,
    paddingVertical: layout.padding_x1,
    alignItems: "center",
    flexDirection: "row",
  },
  svgContainer: {
    borderWidth: 2,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: neutral33,
    borderRadius: 20,
  },
});
