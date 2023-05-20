import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { neutral77 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import FlexRow from "../FlexRow";
import { Separator } from "../Separator";

export const TopMenuSection: React.FC<{
  children: React.ReactNode;
  title: string;
  style?: StyleProp<ViewStyle>;
  isCarousel?: boolean;
}> = ({ title, style, isCarousel, children }) => {
  return (
    <>
      <Separator />
      <FlexCol
        style={[
          styles.container,
          style,
          isCarousel && { paddingHorizontal: 0 },
        ]}
      >
        <FlexRow alignItems="center">
          <BrandText
            style={[
              styles.title,
              isCarousel && { marginLeft: layout.padding_x2 },
            ]}
          >
            {title}
          </BrandText>
        </FlexRow>
        {children}
      </FlexCol>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: layout.padding_x1_5,
    paddingHorizontal: layout.padding_x2,
  },
  title: {
    ...(fontSemibold12 as object),
    color: neutral77,
    marginBottom: layout.padding_x1,
  },
});
