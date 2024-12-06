import Long from "long";
import { FC } from "react";
import { StyleProp, View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { Box, BoxStyle } from "@/components/boxes/Box";
import { Info } from "@/contracts-clients/rakki/Rakki.types";
import { useRakkiTicketsCountByUser } from "@/hooks/rakki/useRakkiTicketsByUser";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { TicketsAndPrice } from "@/screens/Rakki/components/TicketsAndPrice";
import { gameBoxLabelCStyle } from "@/screens/Rakki/styles";
import { prettyPrice } from "@/utils/coins";
import { neutral22, neutral33, neutralA3 } from "@/utils/style/colors";
import { fontMedium10, fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const GameBox: FC<{
  networkId: string;
  info: Info;
  style?: StyleProp<BoxStyle>;
}> = ({ networkId, info, style }) => {
  const selectedWallet = useSelectedWallet();
  const { ticketsCount: userTicketsCount } = useRakkiTicketsCountByUser(
    networkId,
    selectedWallet?.address,
  );
  const totalPrizeAmount = Long.fromString(info.config.ticket_price.amount).mul(
    info.current_tickets_count,
  );
  const userAmount = userTicketsCount
    ? Long.fromString(info.config.ticket_price.amount).mul(userTicketsCount)
    : 0;
  const feePrizeAmount = totalPrizeAmount
    .mul(info.config.fee_per10k)
    .div(10000);
  const winnerPrizeAmount = totalPrizeAmount.sub(feePrizeAmount);
  return (
    <Box notched style={[{ backgroundColor: neutral22 }, style]}>
      <Box
        notched
        style={{
          backgroundColor: neutral33,
          padding: layout.spacing_x1_5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BrandText style={[gameBoxLabelCStyle, { textAlign: "left" }]}>
          Next Draw
        </BrandText>
        <BrandText
          style={[
            {
              textAlign: "right",
            },
            fontSemibold12,
          ]}
        >
          When the {info.config.max_tickets - info.current_tickets_count}{" "}
          remaining tickets will be sold out.
        </BrandText>
      </Box>
      <View
        style={{
          padding: layout.spacing_x1_5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BrandText style={gameBoxLabelCStyle}>Prize Pot</BrandText>
        <TicketsAndPrice
          price={prettyPrice(
            networkId,
            winnerPrizeAmount.toString(),
            info.config.ticket_price.denom,
          )}
          ticketsCount={info.current_tickets_count}
        />
      </View>
      <View
        style={{
          paddingHorizontal: layout.spacing_x1_5,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: layout.spacing_x1_5,
          alignItems: "center",
        }}
      >
        <BrandText style={gameBoxLabelCStyle}>Your tickets</BrandText>
        {userTicketsCount !== null ? (
          <TicketsAndPrice
            price={prettyPrice(
              networkId,
              userAmount.toString(),
              info.config.ticket_price.denom,
            )}
            ticketsCount={userTicketsCount}
          />
        ) : (
          <BrandText
            style={[
              {
                color: neutralA3,
                lineHeight: layout.spacing_x1_5,
              },
              fontMedium10,
            ]}
          >
            Not connected
          </BrandText>
        )}
      </View>
    </Box>
  );
};
