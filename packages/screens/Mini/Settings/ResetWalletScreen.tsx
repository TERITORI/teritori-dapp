import React from "react";
import { Dimensions, View } from "react-native";

import { CustomButton } from "./components/CustomButton";
import { SettingBase } from "./components/SettingBase";
import stopSVG from "../../../../assets/icons/stop.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenFC } from "../../../utils/navigation";
import { neutral77 } from "../../../utils/style/colors";
import { fontMedium16, fontSemibold30 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const ResetWalletScreen: ScreenFC<"MiniResetWallet"> = ({
  navigation,
}) => {
  const gotoSecurityAndPrivacy = () =>
    navigation.replace("MiniSecurityAndPrivacy");

  const onResetPress = () => {
    alert("Reset");
  };

  return (
    <SettingBase
      title="Reset Wallet"
      onGoBack={gotoSecurityAndPrivacy}
      reverseView={false}
      background="transparent"
    >
      <View
        style={{
          position: "relative",
          alignItems: "center",
          paddingHorizontal: layout.spacing_x1_5,
          paddingTop: layout.spacing_x4,
          height: Dimensions.get("window").height - 150,
        }}
      >
        <SVG
          source={stopSVG}
          height={104}
          width={104}
          style={{ marginBottom: layout.spacing_x4 }}
        />
        <BrandText
          style={[fontSemibold30, { marginBottom: layout.spacing_x1_5 }]}
        >
          Reset Wallet
        </BrandText>
        <BrandText style={[fontMedium16, { color: neutral77 }]}>
          Only proceed if you wish to remove all existing accounts and replace
          them with new ones. Make sure to back up your seed phrase and keys
          first.
        </BrandText>
        <CustomButton
          title="Reset"
          onPress={onResetPress}
          type="danger"
          style={{
            position: "absolute",
            bottom: 0,
            left: layout.spacing_x2,
            right: layout.spacing_x2,
            zIndex: 99,
          }}
        />
      </View>
    </SettingBase>
  );
};
