import React from "react";
import { View } from "react-native";

import { useMaxResolution } from "../hooks/useMaxResolution";
import { neutral77 } from "../utils/style/colors";
import { fontSemibold20 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";

export const Section: React.FC<{
  title: string;
  subtitle?: string;
  topRightChild?: React.ReactNode;
}> = ({ children, title, subtitle, topRightChild }) => {
  // variables
  const fontSize = 20;
  const { width } = useMaxResolution();

  // components
  return (
    <View
      style={{
        marginTop: layout.contentPadding,
        overflow: "hidden",
        maxWidth: width,
      }}
    >
      {/* <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: width,
        }}
      > */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          width,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            maxWidth: width - 56,
          }}
        >
          <BrandText
            style={{
              color: "#FFFFFF",
              fontSize,
              letterSpacing: -(fontSize * 0.04),
              flex: 1,
            }}
            numberOfLines={2}
          >
            {title}
          </BrandText>

          {subtitle ? (
            <BrandText
              style={[fontSemibold20, { color: neutral77, marginLeft: 10 }]}
            >
              {subtitle}
            </BrandText>
          ) : null}
        </View>

        <View>{topRightChild}</View>
      </View>
      {/* </View> */}
      {children}
    </View>
  );
};
