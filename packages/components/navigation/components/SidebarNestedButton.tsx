import { useRoute } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { SideNotch } from "./SideNotch";
import { SidebarButtonProps } from "./SidebarButton";
import { useSidebar } from "../../../context/SidebarProvider";
import { neutralA3, primaryColor } from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { CustomPressable } from "../../buttons/CustomPressable";
import { SpacerRow } from "../../spacer";

type SidebarNestedButtonProps = Omit<SidebarButtonProps, "nested">;

export const SidebarNestedButton: React.FC<SidebarNestedButtonProps> = ({
  icon,
  onPress,
  title,
  route,
  iconSize = 20,
}) => {
  const { isSidebarExpanded } = useSidebar();
  const { name: currentRouteName } = useRoute();
  const isComingSoon = route === "ComingSoon";
  const isSelected = route === currentRouteName;

  // animations
  const opacityStyle = useAnimatedStyle(
    () => ({
      opacity: isSidebarExpanded ? withSpring(1) : withSpring(0),
    }),
    [isSidebarExpanded],
  );

  return (
    <CustomPressable
      onPress={isComingSoon ? () => {} : onPress && (() => onPress(route))}
      disabled={isSelected}
      style={styles.container}
    >
      {({ hovered }): React.ReactElement => (
        <>
          {isSelected && <SideNotch />}
          <View style={isComingSoon && { opacity: 0.5 }}>
            <SVG
              width={iconSize}
              height={iconSize}
              source={icon}
              color={isSelected ? primaryColor : neutralA3}
            />
          </View>
          <SpacerRow size={2} />
          <Animated.View style={opacityStyle}>
            <BrandText
              style={[
                fontSemibold12,
                (!isSelected || isComingSoon) && { color: neutralA3 },
              ]}
            >
              {isComingSoon && hovered ? "Coming Soon" : title}
            </BrandText>
          </Animated.View>
        </>
      )}
    </CustomPressable>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.spacing_x1_5,
    alignItems: "center",
    flexDirection: "row",
    height: 32,
    width: "100%",
    position: "relative",
  },
});
