import React from "react";
import { View } from "react-native";

import { BrandText } from "./BrandText";

export const Section: React.FC<{
  title: string;
  topRightChild?: React.ReactNode;
}> = ({ children, title, topRightChild }) => {
  const fontSize = 20;
  return (
    <View style={{ marginBottom: 64 }}>
      <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <BrandText
            style={{
              color: "#FFFFFF",
              fontSize,
              letterSpacing: -(fontSize * 0.04),
              flex: 1,
            }}
          >
            {title}
          </BrandText>
          <>{topRightChild}</>
        </View>
        {children}
      </>
    </View>
  );
};
