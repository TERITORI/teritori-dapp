import React from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { neutral00 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const TaskList: React.FC<{
  iconSVG: React.FC<SvgProps>;
  text: string;
  count: number;
}> = ({ iconSVG, text, count, children }) => {
  return (
    <View style={{ maxWidth: 320, minWidth: 280 }}>
      <FlexRow style={{ flex: 1, marginBottom: layout.padding_x2 }}>
        <SVG source={iconSVG} width={26} height={26} />
        <BrandText
          style={[fontSemibold13, { marginHorizontal: layout.padding_x2 }]}
        >
          {text}
        </BrandText>
        <View
          style={{
            backgroundColor: neutral00,
            borderRadius: 99,
            paddingVertical: 3,
            paddingHorizontal: 10,
          }}
        >
          <BrandText style={fontSemibold13}>{count}</BrandText>
        </View>
      </FlexRow>
      <View>{children}</View>
    </View>
  );
};
