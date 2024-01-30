import React, { ReactNode } from "react";
import {
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

import { Href, router, Routes } from "@/utils/router";

export const OmniLink: React.FC<{
  href: Href<keyof Routes>;
  action?: "navigate" | "replace" | "push";
  children: ReactNode | undefined;
  style?: TouchableOpacityProps["style"];
  disabled?: boolean;
  noHoverEffect?: boolean;
}> = ({
  href,
  action = "navigate",
  children,
  style,
  disabled,
  noHoverEffect,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const onPress = () => {
    router[action](href);
  };
  const handlePress = (e: any) => {
    if (Platform.OS === "web") {
      e.stopPropagation();
      // we prevent default action only if it's not a middle click, a right click, or a ctrl/cmd click
      if (!(e.which === 2 || e.metaKey || e.ctrlKey)) {
        // see https://stackoverflow.com/q/20087368
        e.preventDefault();
        return onPress();
      }
    }
  };

  if (Platform.OS === "web") {
    // It's important to use a `View` or `Text` on web instead of `TouchableX`
    // Otherwise React Native for Web omits the `onClick` prop that's passed
    // You'll also need to pass `onPress` as `onClick` to the `View`
    // You can add hover effects using `onMouseEnter` and `onMouseLeave`
    return (
      <View
        //@ts-expect-error
        onClick={!disabled ? handlePress : null}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={[
          {
            opacity: isHovered && !disabled && !noHoverEffect ? 0.5 : 1,
          },
          { transitionDuration: "150ms" } as ViewStyle, // browser specific
          style,
        ]}
        {...(disabled
          ? {}
          : {
              accessibilityRole: "link",
            })}
      >
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity style={style} onPress={onPress} accessibilityRole="link">
      {children}
    </TouchableOpacity>
  );
};
