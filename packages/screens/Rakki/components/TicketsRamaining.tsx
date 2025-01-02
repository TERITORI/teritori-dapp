import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { Info } from "@/contracts-clients/rakki/Rakki.types";
import { sectionLabelCStyle } from "@/screens/Rakki/styles";
import { primaryColor } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const TicketsRemaining: FC<{
  info: Info;
  style?: StyleProp<ViewStyle>;
}> = ({ info, style }) => {
  return (
    <View style={style}>
      <BrandText style={sectionLabelCStyle}>Get your tickets now!</BrandText>
      <View
        style={{
          gap: layout.spacing_x1_5,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          height: 32,
        }}
      >
        <BrandText
          style={[
            {
              textAlign: "center",
              color: primaryColor,
            },
            fontSemibold28,
          ]}
        >
          {info.config.max_tickets - info.current_tickets_count}
        </BrandText>
        <BrandText
          style={[
            {
              textAlign: "center",
              color: primaryColor,
              marginBottom: 5.4,
            },
            fontSemibold14,
          ]}
        >
          tickets
        </BrandText>
        <BrandText
          style={[
            {
              textAlign: "center",
              marginBottom: 5.4,
            },
            fontSemibold14,
          ]}
        >
          remaining
        </BrandText>
      </View>
    </View>
  );
};
