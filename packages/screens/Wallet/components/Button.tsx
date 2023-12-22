import React from "react";
import { Pressable } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { RouteName, useAppNavigation } from "../../../utils/navigation";
import { fontSemibold15 } from "../../../utils/style/fonts";

export const Button: React.FC<{
  text: string;
  navigate: RouteName;
}> = ({ text, navigate }) => {
  const navigation = useAppNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("Marketplace");
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
      }}
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
