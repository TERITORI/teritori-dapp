import React, { useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import contactsSVG from "../../../../../assets/icons/contacts.svg";
import hamburgerCrossSVG from "../../../../../assets/icons/hamburger-button-cross.svg";
import hamburgerSVG from "../../../../../assets/icons/hamburger-button.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SecondaryButton } from "../../../../components/buttons/SecondaryButton";
import { ConnectWalletModal } from "../../../../components/connectWallet/ConnectWalletModal";
import { BackButton } from "../../../../components/navigation/components/BackButton";
import { SpacerRow } from "../../../../components/spacer";
import { useRWASideBar } from "../../../../context/SidebarProvider";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import { useTheme } from "../../../../hooks/useTheme";
import { selectIsLightTheme } from "../../../../store/slices/settings";
import {
  MOBILE_HEADER_HEIGHT,
  headerHeight,
  layout,
} from "../../../../utils/style/layout";

export type HeaderProps = {
  headerTitle: string;
  onBackPress?: () => void;
};

export const HeaderMobile: React.FC<HeaderProps> = ({
  headerTitle,
  onBackPress,
}) => {
  const theme = useTheme();
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);
  const selectedWallet = useSelectedWallet();
  const { toggleSidebar, isSidebarExpanded } = useRWASideBar();

  const toggleConnectWallet = () =>
    setIsConnectWalletVisible(!isConnectWalletVisible);

  return (
    <View
      style={[
        HeaderContainerCStyle,
        {
          height: MOBILE_HEADER_HEIGHT,
          maxHeight: MOBILE_HEADER_HEIGHT,
          backgroundColor: theme.headerBackgroundColor,
          borderBottomColor: theme.borderColor,
        },
      ]}
    >
      <View style={HeaderRowCStyle}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          {onBackPress && <BackButton onPress={onBackPress} />}
          <SpacerRow size={1} />
          <BrandText
            numberOfLines={1}
            style={{ letterSpacing: -1, fontSize: 20 }}
          >
            {headerTitle}
          </BrandText>
        </View>
        <Pressable onPress={selectedWallet && toggleConnectWallet}>
          <View
            style={[
              ConnectWalletButtonMobileCStyle,
              {
                backgroundColor: theme.headerBackgroundColor,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <SVG
              width={16}
              height={16}
              source={contactsSVG}
              color={theme.textColor}
            />
          </View>
        </Pressable>
        <Pressable
          style={{
            marginRight: layout.spacing_x3,
            marginLeft: layout.spacing_x1,
          }}
          onPress={toggleSidebar}
        >
          <SVG
            width={32}
            height={32}
            source={isSidebarExpanded ? hamburgerCrossSVG : hamburgerSVG}
            color={theme.textColor}
          />
        </Pressable>
        <ConnectWalletModal
          visible={isConnectWalletVisible}
          onClose={toggleConnectWallet}
        />
      </View>
    </View>
  );
};

export const Header: React.FC<HeaderProps> = ({ headerTitle, onBackPress }) => {
  const theme = useTheme();
  const isLightTheme = useSelector(selectIsLightTheme);
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);
  const selectedWallet = useSelectedWallet();

  return (
    <View
      style={[
        HeaderContainerCStyle,
        {
          height: headerHeight,
          maxHeight: headerHeight,
          backgroundColor: theme.headerBackgroundColor,
          borderBottomColor: theme.borderColor,
        },
      ]}
    >
      <View style={HeaderRowCStyle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {onBackPress && <BackButton onPress={onBackPress} />}
          <SpacerRow size={1.5} />
          <BrandText numberOfLines={1} style={{ fontSize: 20 }}>
            {headerTitle}
          </BrandText>
        </View>
        {selectedWallet ? (
          <View style={{ marginRight: 18 }}>
            <SecondaryButton
              backgroundColor={theme.tertiaryButtonColor}
              color={isLightTheme ? theme.secondaryTextColor : theme.textColor}
              text="My Account"
              size="SM"
              width={188}
            />
          </View>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginRight: 18 }}>
              <SecondaryButton
                backgroundColor={theme.secondaryButtonColor}
                color={theme.textColor}
                text="Register"
                size="SM"
                width={188}
              />
            </View>
            <View style={{ marginRight: 18 }}>
              <SecondaryButton
                backgroundColor={theme.primaryButtonColor}
                color={theme.secondaryTextColor}
                text="Connect Wallet"
                size="SM"
                width={188}
                onPress={() => setIsConnectWalletVisible(true)}
              />
              <ConnectWalletModal
                visible={isConnectWalletVisible}
                onClose={() => setIsConnectWalletVisible(false)}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const HeaderContainerCStyle: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  borderBottomWidth: 1,
};

const HeaderRowCStyle: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginLeft: layout.contentSpacing,
};

const ConnectWalletButtonMobileCStyle: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  width: 32,
  height: 32,
  borderWidth: 1,
};
