import React from "react";
import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";

import { Account } from "./Account";
import addSVG from "../../../../assets/icons/add-solid-white.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import dAppStoreSVG from "../../../../assets/icons/dapp-store-solid.svg";
import googleSVG from "../../../../assets/icons/google.svg";
import ledgerSVG from "../../../../assets/icons/ledger.svg";
import lockSVG from "../../../../assets/icons/lock-solid.svg";
import questionSVG from "../../../../assets/icons/question-gray.svg";
import settingSVG from "../../../../assets/icons/setting-solid.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { selectAllWallets, StoreWallet } from "../../../store/slices/wallets";
import { RouteName, ScreenFC } from "../../../utils/navigation";
import { neutral39 } from "../../../utils/style/colors";
import { fontSemibold15, fontSemibold18 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { SettingMenuItem } from "../components/SettingMenuItems";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";
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

type ProviderType = StoreWallet["provider"];
const getProviderLogo = (provider: ProviderType) => {
  switch (provider) {
    case "google":
      return googleSVG;
    case "ledger":
      return ledgerSVG;
    case "native":
      return null; //teritoriSVG;
    default:
      return questionSVG;
  }
};

export const ProfileScreen: ScreenFC<"MiniProfile"> = ({ navigation }) => {
  const onClose = () => navigation.goBack();
  const wallets = useSelector(selectAllWallets);

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
        <FlatList
          data={wallets}
          renderItem={({ item, index }) => {
            return (
              <View key={index}>
                <Account
                  accountName={"Seed Phrase #" + item.index}
                  address={item.address}
                  logo={getProviderLogo(item.provider)}
                  isLast={index === wallets.length - 1}
                />
              </View>
            );
          }}
        />

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
