import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { SecondaryButton } from "../../../../components/buttons/SecondaryButton";
import { ConnectWalletModal } from "../../../../components/connectWallet/ConnectWalletModal";
import { BackButton } from "../../../../components/navigation/components/BackButton";
import { SpacerRow } from "../../../../components/spacer";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import { useIsLightTheme, useTheme } from "../../../../hooks/useTheme";
import { headerHeight, layout } from "../../../../utils/style/layout";

export type HeaderProps = {
  headerTitle: string;
  onBackPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ headerTitle, onBackPress }) => {
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();
  const [isConnectWalletVisible, setIsConnectWalletVisible] =
    React.useState(false);
  const selectedWallet = useSelectedWallet();

  return (
    <View
      style={{
        flex: 1,
        height: headerHeight,
        width: "100%",
        maxHeight: headerHeight,
        backgroundColor: theme.headerBackgroundColor,
        flexDirection: "row",
        borderBottomColor: theme.borderColor,
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: layout.contentSpacing,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <SpacerRow size={8} />
          {onBackPress && <BackButton onPress={onBackPress} />}
          <BrandText
            numberOfLines={1}
            style={{ letterSpacing: -1, marginLeft: 20, fontSize: 20 }}
          >
            {headerTitle}
          </BrandText>
        </View>
        {selectedWallet ? (
          <View style={{ marginRight: 18 }}>
            <SecondaryButton
              textStyle={{ fontWeight: "200" }}
              backgroundColor={theme.tertiaryButtonColor}
              color={isLightTheme ? theme.secondaryTextColor : theme.textColor}
              text="My Account"
              squaresBackgroundColor={theme.headerSquaresBackgroundColor}
              size="SM"
              width={188}
            />
          </View>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginRight: 18 }}>
              <SecondaryButton
                textStyle={{ fontWeight: "200" }}
                borderColor={!isLightTheme ? theme.borderColor : undefined}
                backgroundColor={theme.secondaryButtonColor}
                color={theme.textColor}
                text="Register"
                squaresBackgroundColor={theme.headerSquaresBackgroundColor}
                size="SM"
                width={188}
              />
            </View>
            <View style={{ marginRight: 18 }}>
              <SecondaryButton
                textStyle={{ fontWeight: "200" }}
                backgroundColor={theme.primaryButtonColor}
                color={theme.secondaryTextColor}
                text="Connect Wallet"
                squaresBackgroundColor={theme.headerSquaresBackgroundColor}
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
