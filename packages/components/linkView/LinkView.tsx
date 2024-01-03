import { useLinkProps } from "@react-navigation/native";
import React, { ReactNode } from "react";
import { Platform, TouchableOpacityProps, View, ViewStyle } from "react-native";

interface linkType {
  screen: string | never;
  params?: object;
}

export const LinkView: React.FC<{
  to: linkType;
  action?: any | undefined;
  children: ReactNode | undefined;
  style?: TouchableOpacityProps["style"];
}> = ({ to, action, children, style }) => {
  // @ts-ignore
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

  return (
    <View
      // @ts-expect-error
      onClick={handlePress}
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
};
