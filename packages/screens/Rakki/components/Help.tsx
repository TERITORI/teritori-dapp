import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { grossMaxPrizeAmount, netMaxPrizeAmount } from "../utils";

import { BrandText } from "@/components/BrandText";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { GridList } from "@/components/layout/GridList";
import { Info } from "@/contracts-clients/rakki/Rakki.types";
import { gameBoxLabelCStyle } from "@/screens/Rakki/styles";
import { prettyPrice } from "@/utils/coins";
import { neutral33, neutral77 } from "@/utils/style/colors";
import {
  fontMedium10,
  fontSemibold12,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

interface HelpBoxDefinition {
  title: string;
  description: string;
}

export const Help: FC<{
  info: Info;
  networkId: string;
  style?: StyleProp<ViewStyle>;
}> = ({ info, style, networkId }) => {
  const prettyTicketPrice = prettyPrice(
    networkId,
    info.config.ticket_price.amount,
    info.config.ticket_price.denom,
  );
  const prettyNetMaxPrize = prettyPrice(
    networkId,
    netMaxPrizeAmount(info),
    info.config.ticket_price.denom,
  );
  const prettyMaxPrize = prettyPrice(
    networkId,
    grossMaxPrizeAmount(info),
    info.config.ticket_price.denom,
  );
  const feePercent = (info.config.fee_per10k / 10000) * 100;

  const helpBoxes: HelpBoxDefinition[] = [
    {
      title: "Buy Tickets",
      description: `Prices are ${prettyTicketPrice} per ticket.\nGamblers can buy multiple tickets.`,
    },
    {
      title: "Wait for the Draw",
      description:
        "Players just have to wait until the cash prize pool is reached.",
    },
    {
      title: "Check for Prizes",
      description: `Once the cashprize pool is reached, the winner receive the ${prettyNetMaxPrize} transaction directly!`,
    },
  ];

  return (
    <View style={[{ alignItems: "center", gap: layout.spacing_x3 }, style]}>
      <BrandText style={fontSemibold28}>How to Play RAKKi</BrandText>
      <BrandText style={[{ maxWidth: 302 }, gameBoxLabelCStyle]}>
        {`When the community lottery pool reaches the ${prettyMaxPrize} amount, only one will be the winner!\nSimple!`}
      </BrandText>
      <View style={{ width: "100%" }}>
        <GridList<HelpBoxDefinition>
          minElemWidth={212}
          gap={layout.spacing_x1_75}
          keyExtractor={(item) => item.title}
          noFixedHeight
          data={helpBoxes}
          renderItem={({ item, index }, width) => {
            return (
              <TertiaryBox style={{ width }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: layout.spacing_x1_5,
                    borderBottomWidth: 1,
                    borderBottomColor: neutral33,
                  }}
                >
                  <BrandText style={fontSemibold12}>{item.title}</BrandText>
                  <BrandText style={[fontMedium10, { color: neutral77 }]}>
                    Step {index + 1}
                  </BrandText>
                </View>
                <BrandText
                  style={[
                    gameBoxLabelCStyle,
                    {
                      letterSpacing: -(12 * 0.01),
                      textAlign: "left",
                      padding: layout.spacing_x1_5,
                    },
                  ]}
                >
                  {item.description}
                </BrandText>
              </TertiaryBox>
            );
          }}
        />
        <BrandText
          style={[
            {
              marginTop: layout.spacing_x1_5,
              color: neutral77,
              alignSelf: "center",
            },
            fontSemibold12,
          ]}
        >
          *On the total amount, {feePercent}% are sent to a multisig wallet to
          buyback and burn $TORI token.
        </BrandText>
      </View>
    </View>
  );
};
