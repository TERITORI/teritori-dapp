import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useSelector } from "react-redux";

import { Account } from "./Account";
import { ShareContactQRModal } from "./ShareContactQRModal";
import addSVG from "../../../../assets/icons/add-solid-white.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import copySVG from "../../../../assets/icons/copy.svg";
import dAppStoreSVG from "../../../../assets/icons/dapp-store-solid.svg";
import lockSVG from "../../../../assets/icons/lock-solid.svg";
import profileSVG from "../../../../assets/icons/profile-circle-white.svg";
import settingSVG from "../../../../assets/icons/setting-solid.svg";
import { SettingMenuItem } from "../components/SettingMenuItems";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import Clipboard from "@/modules/Clipboard";
import { selectContactInfo, setContactInfo } from "@/store/slices/message";
import {
  selectAllWallets,
  setSelectedNativeWalletIndex,
} from "@/store/slices/wallets";
import { useAppDispatch } from "@/store/store";
import { RouteName, ScreenFC } from "@/utils/navigation";
import { neutral39 } from "@/utils/style/colors";
import { fontSemibold15, fontSemibold18 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { createSharableLink } from "@/weshnet/services";

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
  const wallets = useSelector(selectAllWallets);
  const dispatch = useAppDispatch();
  const contactInfo = useSelector(selectContactInfo);
  const { setToast } = useFeedbacks();
  const [showQRModal, setShowQRModal] = useState(false);

  const shareLink = createSharableLink({
    ...contactInfo,
  });

  useEffect(() => {
    dispatch(
      setContactInfo({
        shareLink,
      }),
    );
  }, [dispatch, shareLink]);

  const sharableLink = contactInfo?.shareLink || "Teritori";

  const onCopyPress = async () => {
    await Clipboard.setStringAsync(sharableLink);

    setToast({
      mode: "mini",
      message: "Link Copied",
      type: "success",
      duration: 3000,
    });
  };

  // disable multiple wallet creation, remove to re enable multiple
  if (wallets.length !== 0) {
    delete profileScreens[0];
  }

  return (
    <BlurScreenContainer
      noScrollView
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
                <Account account={item} isLast={index === wallets.length - 1} />
              </Pressable>
            );
          }}
          contentContainerStyle={{ flexGrow: 1 }}
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
        <View
          style={{
            paddingVertical: layout.spacing_x1_5,
            flexDirection: "row",
            gap: layout.spacing_x2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomPressable
            onPress={() => setShowQRModal(true)}
            style={{
              paddingVertical: layout.spacing_x1_5,
              flexDirection: "row",
              gap: layout.spacing_x2,
              flex: 1,
            }}
          >
            <SVG source={profileSVG} height={24} width={24} />
            <BrandText>Share my contact</BrandText>
          </CustomPressable>
          <CustomPressable onPress={onCopyPress}>
            <SVG source={copySVG} height={30} width={30} />
          </CustomPressable>
        </View>
      </View>
      <ShareContactQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </BlurScreenContainer>
  );
};
