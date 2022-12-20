import React from "react";
import { View } from "react-native";

import useSelectedWallet from "../hooks/useSelectedWallet";
import { addressToNetwork } from "../utils/network";
import { neutral11, neutral77 } from "../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
} from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { getWalletIconFromTitle } from "../utils/walletManagerHelpers";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { tinyAddress } from "./WalletSelector";
import { SuccessBadge } from "./badges/SuccessBadge";
import { TertiaryBox } from "./boxes/TertiaryBox";

export const WalletStatusBox: React.FC<{ maxAddressLength?: number }> = ({
  maxAddressLength = 10,
}) => {
  const selectedWallet = useSelectedWallet();

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
            <SVG
              source={getWalletIconFromTitle(
                addressToNetwork(selectedWallet.address)
              )}
              height={24}
              style={{ marginRight: layout.padding_x1 }}
            />
            <View>
              <BrandText style={[fontSemibold12, { color: neutral77 }]}>
                {addressToNetwork(selectedWallet.address)}
              </BrandText>
              <BrandText style={[fontSemibold13]}>
                {tinyAddress(selectedWallet.address, maxAddressLength)}
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
