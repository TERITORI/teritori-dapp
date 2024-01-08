import React, { FC } from "react";
import { SafeAreaView, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { Account } from "./components/Account";
import addSVG from "../../../../assets/icons/add-solid-white.svg";
import chevronGrayRightSVG from "../../../../assets/icons/chevron-right-gray.svg";
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
import {
  RouteName,
  ScreenFC,
  useAppNavigation,
} from "../../../utils/navigation";
import { neutral39 } from "../../../utils/style/colors";
import { fontSemibold15, fontSemibold18 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const ProfileScreen: ScreenFC<"MiniProfile"> = ({ navigation }) => {
  const onClose = () => navigation.goBack();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, .9)",
        position: "relative",
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <View style={{ backgroundColor: "#000" }}>
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

            <Separator style={{ marginTop: layout.spacing_x1_5 }} />
            <ProfileMenuItem
              icon={addSVG}
              title="Add Account"
              navigateTo="MiniAddAccount"
            />
            <Separator />
            <ProfileMenuItem
              icon={settingSVG}
              navigateTo="MiniSettings"
              title="Settings"
            />
            <ProfileMenuItem
              icon={dAppStoreSVG}
              title="dApps"
              navigateTo="MiniDAppStore"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

type MenuItemProps = {
  icon: string | FC<SvgProps>;
  title: string;
  navigateTo: RouteName;
};
const ProfileMenuItem = ({ icon, navigateTo, title }: MenuItemProps) => {
  const navigation = useAppNavigation();
  const onMenuItemPress = () => {
    navigation.replace(navigateTo);
  };
  return (
    <CustomPressable onPress={onMenuItemPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: layout.spacing_x2,
          marginBottom: layout.spacing_x1_5,
        }}
      >
        <View style={{ flexDirection: "row", gap: layout.spacing_x1_5 }}>
          <SVG source={icon} height={24} width={24} />
          <BrandText>{title}</BrandText>
        </View>
        <SVG source={chevronGrayRightSVG} height={24} width={24} />
      </View>
    </CustomPressable>
  );
};
