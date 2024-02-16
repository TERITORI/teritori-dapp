import React from "react";
import { View, ViewStyle } from "react-native";

import { InnerCellText } from "@/components/applicationTable/InnerCellText";
import { lightblue, neutral00 } from "@/utils/style/colors";

export const CellBadgeRow: React.FC<{
  style: ViewStyle;
  text: string;
}> = ({ style, text }) => {
  return (
    <View style={style}>
      <InnerCellText
        style={{
          backgroundColor: lightblue,
          borderRadius: 100,
          paddingHorizontal: 10,
          paddingVertical: 5,
          alignSelf: "flex-start",
        }}
        textStyle={{ color: neutral00 }}
      >
        {text}
      </InnerCellText>
    </View>
  );
};
