import React, { FC } from "react";
import { SafeAreaView, View } from "react-native";
import { SvgProps } from "react-native-svg";

import addSVG from "../../../../assets/icons/add-solid-white.svg";
import chevronGrayRightSVG from "../../../../assets/icons/chevron-right-gray.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import copySVG from "../../../../assets/icons/copy-gray.svg";
import dAppStoreSVG from "../../../../assets/icons/dapp-store-solid.svg";
import dotSVG from "../../../../assets/icons/dots-gray.svg";
import googleSVG from "../../../../assets/icons/google.svg";
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
import { neutral33, neutral39, neutralA3 } from "../../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold15,
  fontSemibold18,
  fontSemibold22,
} from "../../../utils/style/fonts";
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
          {/* Main Account Row View */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: layout.spacing_x1,
                }}
              >
                <BrandText style={[fontSemibold22]}>Main Account</BrandText>
                <SVG source={copySVG} height={20} width={20} />
              </View>
              <BrandText style={[fontMedium13, { color: neutralA3 }]}>
                62.424 TORI
              </BrandText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: layout.spacing_x1,
              }}
            >
              <CustomPressable
                style={{
                  backgroundColor: neutral33,
                  padding: layout.spacing_x1,
                  borderRadius: 10,
                }}
              >
                <SVG source={googleSVG} height={20} width={20} />
              </CustomPressable>
              <CustomPressable>
                <SVG source={dotSVG} height={22} width={22} />
              </CustomPressable>
            </View>
          </View>

          <Separator style={{ marginTop: layout.spacing_x1_5 }} />
          <ProfileMenuItem
            icon={addSVG}
            title="Add Account"
            navigateTo="MiniChats"
          />
          <Separator />
          <ProfileMenuItem
            icon={settingSVG}
            navigateTo="MiniChats"
            title="Settings"
          />
          <ProfileMenuItem
            icon={dAppStoreSVG}
            title="dApps"
            navigateTo="MiniDAppStore"
          />
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
