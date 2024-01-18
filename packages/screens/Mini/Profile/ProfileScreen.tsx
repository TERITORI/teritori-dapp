import React from "react";
import { View } from "react-native";

import { Account } from "./components/Account";
import addSVG from "../../../../assets/icons/add-solid-white.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import dAppStoreSVG from "../../../../assets/icons/dapp-store-solid.svg";
import googleSVG from "../../../../assets/icons/google.svg";
import ledgerSVG from "../../../../assets/icons/ledger.svg";
import lockSVG from "../../../../assets/icons/lock-solid.svg";
import settingSVG from "../../../../assets/icons/setting-solid.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { neutral39 } from "../../../utils/style/colors";
import { fontSemibold15, fontSemibold18 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import { SettingMenuItem } from "../components/SettingMenuItems";

export const ProfileScreen: ScreenFC<"MiniProfile"> = ({ navigation }) => {
  const onClose = () => navigation.goBack();

  return (
    <BlurScreenContainer
      customHeader={
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: layout.spacing_x2,
          }}
        >
          <BrandText style={[fontSemibold18]}>Profile</BrandText>
          <CustomPressable
            style={{
              backgroundColor: neutral39,
              paddingHorizontal: layout.spacing_x1_5,
              paddingVertical: layout.spacing_x1,
              borderRadius: 100,
              flexDirection: "row",
              gap: layout.spacing_x1,
            }}
          >
            <SVG source={lockSVG} height={16} width={16} />
            <BrandText style={[fontSemibold15]}>Lock Wallet</BrandText>
          </CustomPressable>
          <CustomPressable onPress={onClose} style={{}}>
            <SVG source={closeSVG} height={28} width={28} />
          </CustomPressable>
        </View>
      }
    >
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          justifyContent: "flex-end",
          flex: 1,
        }}
      >
        <View style={{ zIndex: 300 }}>
          <Account
            accountName="Main Account"
            id="1"
            toriCount={62424}
            logo={googleSVG}
          />
        </View>
        <View style={{ zIndex: 200 }}>
          <Account accountName="Account 2" id="2" toriCount={0} />
        </View>
        <View style={{ zIndex: 100 }}>
          <Account
            accountName="Ledger"
            id="3"
            toriCount={1000}
            logo={ledgerSVG}
            isLast
          />
        </View>

        <SpacerColumn size={1} />
        <Separator />
        <SpacerColumn size={1} />
        <SettingMenuItem
          icon={addSVG}
          navigateTo="MiniAddAccount"
          title="Add Account"
        />
        <SpacerColumn size={1} />
        <Separator />
        <SpacerColumn size={1} />
        <SettingMenuItem
          icon={settingSVG}
          navigateTo="MiniSettings"
          title="Settings"
        />
        <SpacerColumn size={1} />
        <SettingMenuItem
          icon={dAppStoreSVG}
          navigateTo="MiniDAppStore"
          title="dApps"
        />
        <SpacerColumn size={1} />
      </View>
    </BlurScreenContainer>
  );
};
