import React from "react";
import { View } from "react-native";

import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { SettingBase } from "../components/SettingBase";
import { SettingMenuItem } from "../Settings/components/SettingMenuItems";

export const AddAccountScreen: ScreenFC<"MiniAddAccount"> = ({
  navigation,
}) => {
  const goToProfile = () => navigation.replace("MiniProfile");
  return (
    <SettingBase title="Add Account" onGoBack={goToProfile}>
      <View style={{ marginBottom: layout.spacing_x1_5 }}>
        <SettingMenuItem
          navigateTo="MiniAddAccount"
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
    </SettingBase>
  );
};
