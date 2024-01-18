import React from "react";
import { View } from "react-native";

import { Account } from "./Account";
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
import { RouteName, ScreenFC } from "../../../utils/navigation";
import { neutral39 } from "../../../utils/style/colors";
import { fontSemibold15, fontSemibold18 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import { SettingMenuItem } from "../components/SettingMenuItems";

const profileScreens: {
  title: string;
  navigateTo: RouteName;
  icon?: any;
}[] = [
  {
    title: "Add Account",
    navigateTo: "MiniAddAccount",
    icon: addSVG,
  },
  {
    title: "Settings",
    navigateTo: "MiniSettings",
    icon: settingSVG,
  },
  {
    title: "dApps",
    navigateTo: "MiniDAppStore",
    icon: dAppStoreSVG,
  },
];

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
            <SVG source={closeSVG} height={24} width={24} />
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

        <Separator />
        <SpacerColumn size={1} />
        {profileScreens.map((screen, index) => {
          return (
            <>
              <SettingMenuItem
                icon={screen.icon}
                navigateTo={screen.navigateTo}
                title={screen.title}
              />
              {index === 0 && (
                <>
                  <SpacerColumn size={1} />
                  <Separator />
                </>
              )}
              <SpacerColumn size={1} />
            </>
          );
        })}
      </View>
    </BlurScreenContainer>
  );
};
