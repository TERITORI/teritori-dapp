import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import useSelectedWallet from "../../hooks/useSelectedWallet";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import { neutral17, neutral77 } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold13 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { NetworkIcon } from "../NetworkIcon";
import { tinyAddress } from "../WalletSelector";
import { SuccessBadge } from "../badges/SuccessBadge";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const WalletStatusCard: React.FC = () => {
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);

  return (
    <TertiaryBox
      fullWidth
      mainContainerStyle={{
        backgroundColor: neutral17,
        paddingLeft: 8,
        paddingRight: 13,
        paddingTop: 7,
        paddingBottom: 5,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <NetworkIcon networkId={selectedNetworkId} circle size={24} />
        <View style={{ marginLeft: 8 }}>
          <BrandText
            style={[fontSemibold12, { marginBottom: 2, color: neutral77 }]}
          >
            Teritori
          </BrandText>
          <BrandText style={fontSemibold13}>
            {wallet && tinyAddress(wallet.address, 21)}
          </BrandText>
        </View>
      </View>

      <SuccessBadge label="connected" />
    </TertiaryBox>
  );
};
