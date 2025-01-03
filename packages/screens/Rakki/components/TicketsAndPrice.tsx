import { FC } from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { GradientText } from "@/components/gradientText";
import { neutralA3 } from "@/utils/style/colors";
import { fontMedium10, fontSemibold14 } from "@/utils/style/fonts";

export const TicketsAndPrice: FC<{
  ticketsCount: number;
  price: string;
}> = ({ ticketsCount, price }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 18,
        alignItems: "center",
      }}
    >
      <GradientText style={fontSemibold14} gradientType="yellow">
        ~{price}
      </GradientText>
      <BrandText
        style={[
          {
            color: neutralA3,
          },
          fontMedium10,
        ]}
      >
        ({ticketsCount} TICKETS)
      </BrandText>
    </View>
  );
};
