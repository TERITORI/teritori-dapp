import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import tipSVG from "../../../../assets/icons/tip.svg";
import { useTNS } from "../../../context/TNSProvider";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { tokenWithoutTld } from "../../../utils/tns";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SendFundModal } from "../../modals/teritoriNameService/TNSSendFundsModal";
import { SpacerRow } from "../../spacer";

export const TipButton: React.FC<{
  postTokenId: string;
}> = ({ postTokenId }) => {
  const { setName } = useTNS();
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);

  const onPress = () => {
    setName(tokenWithoutTld(postTokenId));
    setSendFundsModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={onPress}
      >
        <SVG source={tipSVG} width={20} height={20} />
        <SpacerRow size={1.5} />
        <BrandText style={fontSemibold14}>0</BrandText>
      </TouchableOpacity>

      <SendFundModal
        onClose={() => {
          setName("");
          setSendFundsModalVisible(false);
        }}
        visible={sendFundsModalVisible}
      />
    </>
  );
};
