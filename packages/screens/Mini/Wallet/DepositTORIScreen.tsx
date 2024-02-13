import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { ScreenFC } from "@/utils/navigation";
import {
  neutral22,
  neutral39,
  neutral77,
  neutralA3,
  secondaryColor,
} from "@/utils/style/colors";
import { fontMedium13, fontMedium16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import { findByBaseDenom } from "@/utils/wallet/chain-registry";

const QR_SIZE = 248;

export const DepositTORIScreen: ScreenFC<"MiniDepositTORI"> = ({
  navigation,
  route,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const { denom } = route.params;
  const onGotoSelectToken = () =>
    navigation.replace("MiniSelectToken", { navigateTo: "MiniDepositTORI" });

  const selectedWallet = useSelectedNativeWallet();

  const onCopyPress = async () => {
    await Clipboard.setStringAsync(selectedWallet?.address || "");
    setIsCopied(true);
    setInterval(() => {
      navigation.navigate("MiniWallets");
    }, 2000);
  };

  const selectedToken = findByBaseDenom(denom)?.assets[0];
  if (!selectedToken) {
    return null;
  }

  return (
    <BlurScreenContainer
      title={`Deposit ${selectedToken.symbol}`}
      onGoBack={onGotoSelectToken}
    >
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: layout.spacing_x5 }}>
          <View
            style={{
              backgroundColor: secondaryColor,
              width: QR_SIZE + 32,
              padding: layout.spacing_x2,
              borderRadius: layout.borderRadius,
            }}
          >
            <QRCode size={QR_SIZE} value={selectedWallet?.address} />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: neutral22,
            padding: layout.spacing_x1_5,
            borderRadius: 10,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: layout.spacing_x1_5,
            }}
          >
            <BrandText style={[fontMedium16]}>
              {/*Other wallets don't show account number*/}
              {/*Account: {selectedWallet?.index}*/}
            </BrandText>
            <BrandText style={[fontMedium16, { color: neutralA3 }]}>
              {tinyAddress(selectedWallet?.address, 30)}
            </BrandText>
          </View>
          <CustomPressable
            onPress={isCopied ? null : onCopyPress}
            style={{
              backgroundColor: !isCopied ? neutral39 : "transparent",
              borderRadius: 20,
              paddingHorizontal: layout.spacing_x1_5,
              paddingVertical: layout.spacing_x0_5,
              borderColor: isCopied ? neutral39 : "transparent",
              borderWidth: 1,
            }}
          >
            <BrandText style={[fontMedium16, { color: neutralA3 }]}>
              {isCopied ? "Copied" : "Copy"}
            </BrandText>
          </CustomPressable>
        </View>
        <BrandText
          style={[
            fontMedium13,
            {
              color: neutral77,
              textAlign: "center",
              marginTop: layout.spacing_x1,
            },
          ]}
        >
          Only use this address to receive tokens on Teritori.
        </BrandText>
      </View>
    </BlurScreenContainer>
  );
};
