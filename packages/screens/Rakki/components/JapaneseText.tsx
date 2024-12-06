import { FC } from "react";
import { TextStyle, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { neutral67, neutralFF } from "@/utils/style/colors";

export const JapaneseText: FC = () => {
  return (
    <View>
      <BrandText
        style={[
          japaneseTextCStyle,
          {
            color: neutral67,
          },
        ]}
      >
        ラ
        <BrandText style={[japaneseTextCStyle, { color: neutralFF }]}>
          ッ
        </BrandText>
        キー
      </BrandText>
    </View>
  );
};

const japaneseTextCStyle: TextStyle = {
  textAlign: "center",
  fontSize: 51.933,
  lineHeight: 62.319 /* 120% */,
  letterSpacing: -2.077,
  fontWeight: "600",
};
