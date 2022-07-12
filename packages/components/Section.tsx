import React from "react";
import { View } from "react-native";

import { BrandText } from "./BrandText";

export const Section: React.FC<{ title: string }> = ({ children, title }) => {
  const fontSize = 20;
  return (
    <View style={{ marginBottom: 64 }}>
      <>
        <BrandText
          style={{
            color: "#FFFFFF",
            fontSize,
            letterSpacing: -(fontSize * 0.04),
            marginBottom: 20,
          }}
        >
          {title}
        </BrandText>
        {children}
      </>
    </View>
  );
};
