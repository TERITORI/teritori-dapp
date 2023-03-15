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
  screen: string;
  params?: object;
}

export const OmniLink: React.FC<{
  to: OmniLinkToType;
  action?: any | undefined;
  children: ReactNode | undefined;
  style?: StyleProp<ViewStyle | TouchableOpacityProps>;

  disabled?: boolean;
}> = ({ to, action, children, style, disabled, ...rest }) => {
  // @ts-expect-error
  const { onPress, ...props } = useLinkProps({ to, action });

  const [isHovered, setIsHovered] = React.useState(false);

  if (Platform.OS === "web") {
    // It's important to use a `View` or `Text` on web instead of `TouchableX`
    // Otherwise React Native for Web omits the `onClick` prop that's passed
    // You'll also need to pass `onPress` as `onClick` to the `View`
    // You can add hover effects using `onMouseEnter` and `onMouseLeave`
    return (
      <View
        // @ts-expect-error
        onClick={!disabled ? onPress : null}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={[
          {
            transitionDuration: "150ms",
            opacity: isHovered ? 0.5 : 1,
          } as StyleProp<ViewStyle>,
          style,
        ]}
        {...props}
        {...rest}
      >
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity style={style} onPress={onPress} {...props} {...rest}>
      {children}
    </TouchableOpacity>
  );
};
