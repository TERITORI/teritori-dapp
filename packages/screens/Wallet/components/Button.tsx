import React from "react";
import { Pressable } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { RouteName, useAppNavigation } from "../../../utils/navigation";
import { fontSemibold15 } from "../../../utils/style/fonts";

export const Button: React.FC<{
  text: string;
  navigateTo: RouteName;
  disabled?: boolean;
}> = ({ text, navigateTo, disabled = false }) => {
  const navigation = useAppNavigation();
  return (
    <Pressable
      onPress={() => {
        // @ts-ignore
        navigation.navigate(navigateTo);
      }}
      style={{
        width: 361,
        paddingVertical: 12,
        paddingHorizontal: 40,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        borderRadius: 100,
        backgroundColor: "#007AFF",
        opacity: disabled ? 0.5 : 1,
      }}
      disabled={disabled}
    >
      <BrandText
        style={{
          ...fontSemibold15,
          color: "white",
        }}
      >
        {text}
      </BrandText>
    </Pressable>
  );
};
