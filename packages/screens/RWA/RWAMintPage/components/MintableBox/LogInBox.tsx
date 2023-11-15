import React from "react";
import { View } from "react-native";

import { SecondaryButton } from "../../../../../components/buttons/SecondaryButton";
import { ConnectWalletModal } from "../../../../../components/connectWallet/ConnectWalletModal";
import { useIsLightTheme, useTheme } from "../../../../../hooks/useTheme";
import { MintPageBoxHeader } from "../MintPageBoxHeader";

export const LogInBox: React.FC = () => {
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();
  const [isConnectWalletVisible, setIsConnectWalletVisible] =
    React.useState<boolean>(false);

  return (
    <MintPageBoxHeader title="Log In to access the Property Sale">
      <View style={{ paddingHorizontal: 48, width: "100%", marginBottom: 10 }}>
        <SecondaryButton
          fullWidth
          textStyle={{ fontWeight: "200" }}
          borderColor={!isLightTheme ? theme.borderColor : undefined}
          backgroundColor={theme.secondaryButtonColor}
          color={theme.textColor}
          text="Register"
          squaresBackgroundColor={theme.headerBackgroundColor}
          size="M"
        />
        <View style={{ marginVertical: 4 }} />
        <SecondaryButton
          fullWidth
          textStyle={{ fontWeight: "200" }}
          backgroundColor={theme.primaryButtonColor}
          color={theme.secondaryTextColor}
          text="Connect Wallet"
          squaresBackgroundColor={theme.headerBackgroundColor}
          size="M"
          onPress={() => setIsConnectWalletVisible(true)}
        />
        <ConnectWalletModal
          visible={isConnectWalletVisible}
          onClose={() => setIsConnectWalletVisible(false)}
        />
      </View>
    </MintPageBoxHeader>
  );
};
