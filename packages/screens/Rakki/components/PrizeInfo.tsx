import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { netMaxPrizeAmount } from "../utils";

import { BrandText } from "@/components/BrandText";
import { GradientText } from "@/components/gradientText";
import { Info } from "@/contracts-clients/rakki/Rakki.types";
import { IntroTicketImageButton } from "@/screens/Rakki/components/IntroTicketImageButton";
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
  const prettyMaxPrizeAmount = prettyPrice(
    networkId,
    netMaxPrizeAmount(info),
    info.config.ticket_price.denom,
  );

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
        {prettyMaxPrizeAmount}
      </GradientText>
      <BrandText
        style={[
          {
            textAlign: "center",
            marginTop: layout.spacing_x1_5,
            marginBottom: 50,
          },
          fontSemibold14,
        ]}
      >
        in prizes!
      </BrandText>

      <IntroTicketImageButton networkId={networkId} info={info} />
    </View>
  );
};
