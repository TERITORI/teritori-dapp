import React from "react";
import { View } from "react-native";

import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { SettingMenuItem } from "../Settings/components/SettingMenuItems";
import { BlurScreenContainer } from "../components/BlurScreenContainer";

export const AddAccountScreen: ScreenFC<"MiniAddAccount"> = ({
  navigation,
}) => {
  const goToProfile = () => navigation.replace("MiniProfile");
  return (
    <BlurScreenContainer title="Add Account" onGoBack={goToProfile}>
      <View style={{ marginBottom: layout.spacing_x1_5 }}>
        <SettingMenuItem
          navigateTo="NativeWallet"
          title="Create new account"
          subtitle="Generate a new account"
        />
        <SettingMenuItem
          navigateTo="MiniAddAccount"
          title="Import private key"
          subtitle="Import private key"
        />
        <SettingMenuItem
          navigateTo="MiniAddAccount"
          title="Connect Ledger"
          subtitle="Add a Ledger account"
        />
      </View>
    </BlurScreenContainer>
  );
};
