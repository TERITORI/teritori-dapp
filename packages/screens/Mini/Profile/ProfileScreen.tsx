import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useSelector } from "react-redux";

import { Account } from "./Account";
import addSVG from "../../../../assets/icons/add-solid-white.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import copySVG from "../../../../assets/icons/copy.svg";
import dAppStoreSVG from "../../../../assets/icons/dapp-store-solid.svg";
import googleSVG from "../../../../assets/icons/google.svg";
import ledgerSVG from "../../../../assets/icons/ledger.svg";
import lockSVG from "../../../../assets/icons/lock-solid.svg";
import profileSVG from "../../../../assets/icons/profile-circle-white.svg";
import questionSVG from "../../../../assets/icons/question-gray.svg";
import settingSVG from "../../../../assets/icons/setting-solid.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import {
  selectContactInfo,
  setContactInfo,
} from "../../../store/slices/message";
import {
  StoreWallet,
  selectAllWallets,
  setSelectedNativeWalletIndex,
} from "../../../store/slices/wallets";
import { useAppDispatch } from "../../../store/store";
import { RouteName, ScreenFC } from "../../../utils/navigation";
import { neutral39 } from "../../../utils/style/colors";
import {
  fontMedium10,
  fontSemibold15,
  fontSemibold18,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { createSharableLink } from "../../../weshnet/services";
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
  const dispatch = useAppDispatch();
  const contactInfo = useSelector(selectContactInfo);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const shareLink = createSharableLink({
      ...contactInfo,
    });
    dispatch(
      setContactInfo({
        shareLink,
      }),
    );
    //TODO: remove this; import/export account will replace this functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onCopyPress = async () => {
    await Clipboard.setStringAsync(contactInfo?.shareLink);

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

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
              <Pressable
                key={index}
                onPress={() => {
                  dispatch(setSelectedNativeWalletIndex(item.index));
                  onClose();
                }}
              >
                <Account
                  accountName={"Seed Phrase #" + item.index}
                  address={item.address}
                  logo={getProviderLogo(item.provider) || undefined}
                  isLast={index === wallets.length - 1}
                />
              </Pressable>
            );
          }}
        />

        <Separator />

        <SpacerColumn size={1} />
        {profileScreens.map((screen, index) => {
          return (
            <React.Fragment key={screen.title}>
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
            </React.Fragment>
          );
        })}
        <CustomPressable onPress={onCopyPress}>
          <View
            style={{
              paddingVertical: layout.spacing_x1_5,
              flexDirection: "row",
              gap: layout.spacing_x2,
            }}
          >
            <SVG source={profileSVG} height={24} width={24} />
            <BrandText>Share my contact</BrandText>
            <SVG source={copySVG} height={24} width={24} />
            {isCopied && <BrandText style={[fontMedium10]}>copied</BrandText>}
          </View>
        </CustomPressable>
      </View>
    </BlurScreenContainer>
  );
};
