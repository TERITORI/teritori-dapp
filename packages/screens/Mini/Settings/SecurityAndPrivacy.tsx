import React from "react";

import { SettingBase } from "./components/SettingBase";
import { SettingMenuItem } from "./components/SettingMenuItems";
import { ScreenFC } from "../../../utils/navigation";

export const SecurityAndPrivacy: ScreenFC<"MiniSecurityAndPrivacy"> = ({
  navigation,
}) => {
  const gotoSettings = () => navigation.navigate("MiniSettings");
  return (
    <SettingBase title="Security & Privacy" onGoBack={gotoSettings}>
      <SettingMenuItem
        title="Change Password"
        navigateTo="MiniChangePassword"
      />
      <SettingMenuItem
        title="Reveal Seed Phrase"
        navigateTo="MiniRevealSeedPhrase"
      />
      <SettingMenuItem
        title="Export Private Key"
        navigateTo="MiniSecurityAndPrivacy"
      />
      <SettingMenuItem
        title="Reset Wallet"
        navigateTo="MiniSecurityAndPrivacy"
        danger
      />
    </SettingBase>
  );
};
