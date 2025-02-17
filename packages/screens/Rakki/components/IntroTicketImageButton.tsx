import { FC } from "react";
import { View } from "react-native";

import { Info } from "@/contracts-clients/rakki";
import { BuyTicketsButton } from "@/screens/Rakki/components/BuyTickets/BuyTicketsButton";
import { TicketImage } from "@/screens/Rakki/components/TicketImage";

interface IntroTicketImageButtonProps {
  networkId: string;
  info: Info;
  onSuccess: () => void;
}

export const IntroTicketImageButton: FC<IntroTicketImageButtonProps> = ({
  networkId,
  info,
  onSuccess,
}) => {
  return (
    <View>
      <TicketImage />
      <View
        style={{
          position: "absolute",
          left: 200,
          top: 66,
          height: 56,
          justifyContent: "center",
          transform: "rotate(-6deg)",
        }}
      >
        <BuyTicketsButton
          networkId={networkId}
          info={info}
          onSuccess={onSuccess}
        />
      </View>
    </View>
  );
};
