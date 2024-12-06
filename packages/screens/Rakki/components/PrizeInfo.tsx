import Long from "long";
import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import rakkiTicketImage from "@/assets/logos/rakki-ticket.png";
import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { GradientText } from "@/components/gradientText";
import { Info } from "@/contracts-clients/rakki/Rakki.types";
import { prettyPrice } from "@/utils/coins";
import {
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const PrizeInfo: FC<{
  info: Info;
  networkId: string;
  style?: StyleProp<ViewStyle>;
}> = ({ info, networkId, style }) => {
  const totalPrizeAmount = Long.fromString(info.config.ticket_price.amount).mul(
    info.config.max_tickets,
  );
  const feePrizeAmount = totalPrizeAmount
    .mul(info.config.fee_per10k)
    .div(10000);
  const winnerPrizeAmount = totalPrizeAmount.sub(feePrizeAmount);
  return (
    <View style={[{ alignItems: "center" }, style]}>
      <BrandText
        style={[
          {
            textAlign: "center",
            marginBottom: layout.spacing_x1_5,
          },
          fontSemibold20,
        ]}
      >
        Automated Lottery
      </BrandText>
      <GradientText style={fontSemibold28} gradientType="yellow">
        {prettyPrice(
          networkId,
          winnerPrizeAmount.toString(),
          info.config.ticket_price.denom,
        )}
      </GradientText>
      <BrandText
        style={[
          {
            textAlign: "center",
            marginTop: layout.spacing_x1_5,
          },
          fontSemibold14,
        ]}
      >
        in prizes!
      </BrandText>
      <OptimizedImage
        sourceURI={rakkiTicketImage}
        style={{ width: 457, height: 260, marginTop: 50 }}
        width={457}
        height={260}
      />
    </View>
  );
};
