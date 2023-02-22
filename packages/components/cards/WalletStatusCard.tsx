import React from "react";
import { View } from "react-native";

import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutral17, neutral77 } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold13 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { tinyAddress } from "../WalletSelector";
import { SuccessBadge } from "../badges/SuccessBadge";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { NetworkIcon } from "../images/NetworkIcon";

export const WalletStatusCard: React.FC = () => {
  const wallet = useSelectedWallet();
  const selectedNetworkInfo = useSelectedNetworkInfo();

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
        <NetworkIcon network={selectedNetworkInfo?.network} circle size={24} />
        <View style={{ marginLeft: 8 }}>
          <BrandText
            style={[fontSemibold12, { marginBottom: 2, color: neutral77 }]}
          >
            {selectedNetworkInfo?.network}
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
