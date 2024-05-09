import { useLinkProps } from "@react-navigation/native";
import React, { ReactNode, useEffect } from "react";
import {
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

interface OmniLinkToType {
  screen: string | never;
  params?: object;
}

export const OmniLink: React.FC<{
  to: OmniLinkToType;
  action?: any | undefined;
  children: ReactNode | undefined;
  style?: TouchableOpacityProps["style"];
  disabled?: boolean;
  noHoverEffect?: boolean;
  onHover?: (isHovered: boolean) => void;
  isHovered?: boolean;
}> = ({
  to,
  action,
  children,
  style,
  disabled,
  noHoverEffect,
  onHover,
  isHovered = false,
}) => {
  // @ts-expect-error: description todo
  const { onPress, ...props } = useLinkProps({ to, action });

  const [localIsHovered, setLocalIsHovered] = React.useState(isHovered);

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

  useEffect(() => {
    onHover?.(localIsHovered);
  }, [onHover, localIsHovered]);

  if (Platform.OS === "web") {
    // It's important to use a `View` or `Text` on web instead of `TouchableX`
    // Otherwise React Native for Web omits the `onClick` prop that's passed
    // You'll also need to pass `onPress` as `onClick` to the `View`
    // You can add hover effects using `onMouseEnter` and `onMouseLeave`
    return (
      <View
        // @ts-expect-error: description todo
        onClick={!disabled ? handlePress : null}
        onMouseEnter={() => setLocalIsHovered(true)}
        onMouseLeave={() => setLocalIsHovered(false)}
        style={[
          {
            opacity:
              (isHovered || localIsHovered) && !disabled && !noHoverEffect
                ? 0.5
                : 1,
          },
          { transitionDuration: "150ms" } as ViewStyle, // browser specific
          style,
        ]}
        {...(disabled ? {} : props)}
      >
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity style={style} onPress={onPress} {...props}>
      {children}
    </TouchableOpacity>
  );
};
