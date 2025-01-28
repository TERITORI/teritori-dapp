import { FC, useState } from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { Box } from "@/components/boxes/Box";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Info } from "@/contracts-clients/rakki/Rakki.types";
import { BuyTicketsModal } from "@/screens/Rakki/components/BuyTickets/BuyTicketsModal";
import { neutral00, neutralFF, rakkiYellow } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";

interface BuyTicketsButtonProps {
  networkId: string;
  info: Info;
  onSuccess: () => void;
}

export const BuyTicketsButton: FC<BuyTicketsButtonProps> = ({
  networkId,
  info,
  onSuccess,
}) => {
  const [isButtonHovered, setButtonHovered] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

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
        onSuccess={onSuccess}
        visible={isModalVisible}
        setModalVisible={setModalVisible}
        info={info}
        networkId={networkId}
      />
    </View>
  );
};
