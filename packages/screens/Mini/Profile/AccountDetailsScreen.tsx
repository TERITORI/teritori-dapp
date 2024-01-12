import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import copySVG from "../../../../assets/icons/copy-gray.svg";
import openSVG from "../../../../assets/icons/open-blue.svg";
import penSVG from "../../../../assets/icons/pen-solid-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { ScreenFC } from "../../../utils/navigation";
import {
  azureBlue,
  azureBlue20,
  neutral22,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium16, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { SettingBase } from "../components/SettingBase";

const QR_SIZE = 248;
const ACCOUNT_DETAILS = "GxF34g10nz0wchvkkj7rr09vcxj5rpt2m3A31";

export const AccountDetailsScreen: ScreenFC<"MiniAccountDetails"> = ({
  navigation,
  route,
}) => {
  const navigateToProfile = () => navigation.replace("MiniProfile");
  const params = route.params;
  const [accountName, setAccountName] = useState(params.accountName);
  const [accountDetails, setAccountDetails] = useState(ACCOUNT_DETAILS);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(accountDetails);
    alert("Copied");
  };

  const onAccountNameChange = (text: string) => {
    setAccountName(text || "");
    setAccountDetails(ACCOUNT_DETAILS);
  };

  const handleViewOnTeritoriscan = () => {};

  return (
    <SettingBase
      title="Account Details"
      onGoBack={navigateToProfile}
      reverseView={false}
      background="transparent"
    >
      <View
        style={{
          marginTop: layout.spacing_x3,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x2,
            backgroundColor: neutral22,
            borderRadius: 10,
            height: 50,
            paddingHorizontal: layout.spacing_x2,
            marginBottom: layout.spacing_x5,
          }}
        >
          <SVG source={penSVG} height={22} width={22} />
          <TextInput
            style={[fontMedium16, { flex: 1, color: secondaryColor }]}
            value={accountName || ""}
            onChangeText={onAccountNameChange}
            cursorColor={secondaryColor}
          />
        </View>
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
              <QRCode size={QR_SIZE} value={accountDetails} />
            </View>
          )}
        </View>
        <View
          style={{
            backgroundColor: neutral22,
            paddingHorizontal: layout.spacing_x2,
            paddingVertical: layout.spacing_x2,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: layout.spacing_x1_5,
            borderRadius: layout.borderRadius,
          }}
        >
          <BrandText style={[fontSemibold14, {}]}>{accountDetails}</BrandText>
          <CustomPressable onPress={copyToClipboard}>
            <SVG source={copySVG} height={22} width={22} />
          </CustomPressable>
        </View>
        <View
          style={{
            backgroundColor: azureBlue20,
            paddingHorizontal: layout.spacing_x2,
            paddingVertical: layout.spacing_x2,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: layout.borderRadius,
          }}
        >
          <BrandText style={[fontSemibold14, { color: azureBlue }]}>
            View on Teritoriscan
          </BrandText>
          <CustomPressable onPress={handleViewOnTeritoriscan}>
            <SVG source={openSVG} height={22} width={22} />
          </CustomPressable>
        </View>
      </View>
    </SettingBase>
  );
};
