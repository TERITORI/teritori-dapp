import React from "react";
import { View } from "react-native";

import { BrandText } from "./BrandText";
import { NetworkIcon } from "./NetworkIcon";
import { SuccessBadge } from "./badges/SuccessBadge";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { useSelectedNetworkInfo } from "../hooks/useSelectedNetwork";
import useSelectedWallet from "../hooks/useSelectedWallet";
import { neutral11, neutral77 } from "../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
} from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

export const WalletStatusBox: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkInfo = useSelectedNetworkInfo();

  return (
    <TertiaryBox
      fullWidth
      mainContainerStyle={{
        paddingVertical: layout.padding_x1,
        paddingHorizontal: layout.padding_x1_5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 48,
        backgroundColor: neutral11,
      }}
    >
      {selectedWallet ? (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <NetworkIcon networkId={selectedNetworkInfo?.id || ""} size={24} />
            <View style={{ marginLeft: layout.padding_x1 }}>
              <BrandText style={[fontSemibold12, { color: neutral77 }]}>
                {selectedNetworkInfo?.displayName}
              </BrandText>
              <BrandText style={[fontSemibold13]}>
                {selectedWallet.address}
              </BrandText>
            </View>
          </View>
          <SuccessBadge label="connected" />
        </>
      ) : (
        <BrandText style={fontSemibold14}>Wallet is not connected</BrandText>
      )}
    </TertiaryBox>
  );
};
