import React from "react";

import { SettingMenuItem } from "./components/SettingMenuItems";
import { ScreenFC } from "../../../utils/navigation";
import { BlurScreenContainer } from "../components/BlurScreenContainer";

export const SecurityAndPrivacy: ScreenFC<"MiniSecurityAndPrivacy"> = ({
  navigation,
}) => {
  const gotoSettings = () => navigation.replace("MiniSettings");
  return (
    <BlurScreenContainer title="Security & Privacy" onGoBack={gotoSettings}>
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
        navigateTo="MiniExportPrivateKey"
      />
      <SettingMenuItem
        title="Reset Wallet"
        navigateTo="MiniResetWallet"
        danger
      />
    </BlurScreenContainer>
  );
};
