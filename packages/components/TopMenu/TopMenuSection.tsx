import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { neutral77 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import FlexRow from "../FlexRow";
import { Separator } from "../Separator";

export const TopMenuSection: React.FC<{
  title: string;
  style?: StyleProp<ViewStyle>;
  isCarousel?: boolean;
}> = ({ title, style, isCarousel, children }) => {
  return (
    <>
      <Separator />
      <FlexCol
        style={[containerStyle, style, isCarousel && { paddingHorizontal: 0 }]}
      >
        <FlexRow alignItems="center">
          <BrandText
            style={[
              titleStyle,
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

const containerStyle: ViewStyle = {
  paddingVertical: layout.padding_x1_5,
  paddingHorizontal: layout.padding_x2,
};
const titleStyle: TextStyle = {
  ...fontSemibold12,
  color: neutral77,
  marginBottom: layout.padding_x1,
};
