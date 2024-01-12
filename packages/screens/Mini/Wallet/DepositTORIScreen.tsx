import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { BrandText } from "../../../components/BrandText";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { ScreenFC } from "../../../utils/navigation";
import {
  neutral22,
  neutral39,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium13, fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { SettingBase } from "../components/SettingBase";

const QR_SIZE = 248;
const accountDetails = {
  token: "GxF34g10nz0wchvkkj7rr09vcxj5rpt2m3A31",
  account: "Account 1",
};

export const DepositTORIScreen: ScreenFC<"MiniDepositTORI"> = ({
  navigation,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const onGotoSelectToken = () =>
    navigation.replace("MiniSelectToken", { navigateTo: "MiniDepositTORI" });

  const onCopyPress = async () => {
    await Clipboard.setStringAsync(JSON.stringify(accountDetails));
    setIsCopied(true);
  };

  return (
    <SettingBase
      title="Deposit TORI"
      reverseView={false}
      background="transparent"
      onGoBack={onGotoSelectToken}
    >
      <View
        style={{
          paddingHorizontal: layout.spacing_x1_5,
          marginBottom: layout.spacing_x2,
          alignItems: "center",
          justifyContent: "center",
          height: Dimensions.get("window").height - 150,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: layout.spacing_x5 }}>
          {accountDetails && (
            <View
              style={{
                backgroundColor: secondaryColor,
                width: QR_SIZE + 32,
                padding: layout.spacing_x2,
                borderRadius: layout.borderRadius,
              }}
            >
              <QRCode size={QR_SIZE} value={JSON.stringify(accountDetails)} />
            </View>
          )}
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
            <BrandText style={[fontMedium16, {}]}>
              {accountDetails.account}
            </BrandText>
            <BrandText style={[fontMedium16, { color: neutralA3 }]}>
              {`( ${accountDetails.token.substring(
                0,
                5,
              )}...${accountDetails.token.substring(
                accountDetails.token.length - 4,
                accountDetails.token.length,
              )})`}
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
    </SettingBase>
  );
};
