import React from "react";
import { View } from "react-native";

import { SettingMenuItem } from "../components/SettingMenuItems";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { ScreenFC } from "@/utils/navigation";
import { layout } from "@/utils/style/layout";

export const AddAccountScreen: ScreenFC<"MiniAddAccount"> = ({
  navigation,
}) => {
  const goToProfile = () => navigation.replace("MiniProfile");
  return (
    <BlurScreenContainer title="Add Account" onGoBack={goToProfile}>
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <SettingMenuItem
          navigateTo="NativeWallet"
          title="Create new account"
          subtitle="Generate a new account"
        />
        <SettingMenuItem
          navigateTo="ImportWallet"
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
