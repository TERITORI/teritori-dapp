import { useLinkProps } from "@react-navigation/native";
import React, { ReactNode } from "react";
import {
  Platform,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

export interface OmniLinkToType {
  screen: string | never;
  params?: object;
}

export const OmniLink: React.FC<{
  to: OmniLinkToType;
  action?: any | undefined;
  children: ReactNode | undefined;
  style?: StyleProp<ViewStyle | TouchableOpacityProps>;
  disabled?: boolean;
}> = ({ to, action, children, style, disabled }) => {
  // @ts-ignore
  const { onPress, ...props } = useLinkProps({ to, action });

  const [isHovered, setIsHovered] = React.useState(false);

  if (Platform.OS === "web") {
    // It's important to use a `View` or `Text` on web instead of `TouchableX`
    // Otherwise React Native for Web omits the `onClick` prop that's passed
    // You'll also need to pass `onPress` as `onClick` to the `View`
    // You can add hover effects using `onMouseEnter` and `onMouseLeave`
    return (
      <View
        // is required to ignore the following to fix a problem with the linter
        // and allow to use onClick in this special case
        // @ts-expect-error
        onClick={!disabled ? onPress : null}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={[
          {
            opacity: isHovered ? 0.5 : 1,
          },
          { transitionDuration: "150ms" } as ViewStyle, // browser specific
          style,
        ]}
        {...props}
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
