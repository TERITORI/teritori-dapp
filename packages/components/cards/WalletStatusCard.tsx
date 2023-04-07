import React from "react";
import { View } from "react-native";

import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getNetwork } from "../../networks";
import { neutral17, neutral77 } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold13 } from "../../utils/style/fonts";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { NetworkIcon } from "../NetworkIcon";
import { SuccessBadge } from "../badges/SuccessBadge";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const WalletStatusCard: React.FC = () => {
  const wallet = useSelectedWallet();
  const selectedNetworkInfo = getNetwork(wallet?.networkId);

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
        <NetworkIcon networkId={selectedNetworkInfo?.id || ""} size={24} />
        <View style={{ marginLeft: 8 }}>
          <BrandText
            style={[fontSemibold12, { marginBottom: 2, color: neutral77 }]}
          >
            {selectedNetworkInfo?.displayName}
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
