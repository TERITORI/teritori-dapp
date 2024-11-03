import { useLinkProps } from "@react-navigation/native";
import React, { ReactNode } from "react";
import {
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { CustomPressable } from "@/components/buttons/CustomPressable";

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
}> = ({ to, action, children, style, disabled, noHoverEffect }) => {
  // @ts-expect-error: description todo
  const { onPress, ...props } = useLinkProps({ to, action });

  const [isHovered, setIsHovered] = React.useState(false);

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
    return (
      <CustomPressable
        onPress={!disabled ? handlePress : null}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[
          {
            opacity: isHovered && !disabled && !noHoverEffect ? 0.5 : 1,
          },
          style,
        ]}
        {...(disabled ? {} : props)}
      >
        {children}
      </CustomPressable>
    );
  }

  return (
    <TouchableOpacity
      style={style}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};
