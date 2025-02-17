import React, { ReactNode } from "react";
import { View } from "react-native";

import { BrandText } from "./BrandText";
import { neutral77 } from "../utils/style/colors";
import { fontRegular20 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

export const Section: React.FC<{
  title?: string;
  subtitle?: string;
  topRightChild?: ReactNode;
  children: ReactNode;
}> = ({ children, title, subtitle, topRightChild }) => {
  const fontSize = 20;

  // components
  return (
    <View
      style={{
        marginTop: layout.contentSpacing,
        overflow: "hidden",
        width: "100%",
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
            {!!title && (
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
            )}

            {subtitle ? (
              <BrandText
                style={[fontRegular20, { color: neutral77, marginLeft: 9 }]}
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
