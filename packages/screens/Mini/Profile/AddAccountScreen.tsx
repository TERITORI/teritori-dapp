import React from "react";
import { View } from "react-native";

import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import { SettingMenuItem } from "../components/SettingMenuItems";

export const AddAccountScreen: ScreenFC<"MiniAddAccount"> = ({
  navigation,
}) => {
  const goToProfile = () => navigation.replace("MiniProfile");
  return (
    <BlurScreenContainer title="Add Account" onGoBack={goToProfile}>
      <View style={{ paddingHorizontal: layout.spacing_x2 }}>
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
        <SpacerColumn size={1.5} />
      </View>
    </BlurScreenContainer>
  );
};
