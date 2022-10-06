import React from "react";
import { View } from "react-native";

import { neutral77 } from "../utils/style/colors";
import { fontSemibold20 } from "../utils/style/fonts";
import { screenContentMaxWidth } from "../utils/style/layout";
import { BrandText } from "./BrandText";

export const Section: React.FC<{
  title: string;
  subtitle?: string;
  topRightChild?: React.ReactNode;
}> = ({ children, title, subtitle, topRightChild }) => {
  const fontSize = 20;
  return (
    <View
      style={{
        marginTop: 56,
        overflow: "hidden",
        width: "100%",
        maxWidth: screenContentMaxWidth,
      }}
    >
      <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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

            {subtitle ? (
              <BrandText
                style={[fontSemibold20, { color: neutral77, marginLeft: 9 }]}
              >
                {subtitle}
              </BrandText>
            ) : null}
          </View>

          <>{topRightChild}</>
        </View>
        {children}
      </>
    </View>
  );
};
