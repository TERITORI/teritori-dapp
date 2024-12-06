import Long from "long";
import { FC, useEffect, useState } from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { Box } from "@/components/boxes/Box";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Info } from "@/contracts-clients/rakki/Rakki.types";
import { BuyTicketsModal } from "@/screens/Rakki/components/BuyTickets/BuyTicketsModal";
import { neutral00, neutralFF, rakkiYellow } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";

export const BuyTicketsButton: FC<{ networkId: string; info: Info }> = ({
  networkId,
  info,
}) => {
  const [isButtonHovered, setButtonHovered] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const remainingTickets = info.config.max_tickets - info.current_tickets_count;
  const [ticketAmount, setTicketAmount] = useState("1");
  const ticketAmountNumber = Long.fromString(ticketAmount || "0");
  useEffect(() => {
    if (remainingTickets > 0 && ticketAmountNumber.gt(remainingTickets)) {
      setTicketAmount(remainingTickets.toString());
    }
  }, [ticketAmountNumber, remainingTickets]);

  return (
    <View style={{ flexDirection: "row" }}>
      <CustomPressable
        onPress={() => setModalVisible(true)}
        onHoverIn={() => setButtonHovered(true)}
        onHoverOut={() => setButtonHovered(false)}
      >
        <Box
          notched
          style={[
            {
              width: 120,
              height: 56,
              backgroundColor: rakkiYellow,
              justifyContent: "center",
              alignItems: "center",
            },
            isButtonHovered && { borderWidth: 3, borderColor: neutralFF },
          ]}
        >
          <BrandText style={[fontSemibold14, { color: neutral00 }]}>
            Buy ッ Tickets
          </BrandText>
        </Box>
      </CustomPressable>

      <BuyTicketsModal
        visible={isModalVisible}
        setModalVisible={setModalVisible}
        info={info}
        networkId={networkId}
      />
    </View>
  );
};
