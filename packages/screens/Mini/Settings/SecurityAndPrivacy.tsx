import React, { Fragment } from "react";
import { View } from "react-native";

import { SpacerColumn } from "../../../components/spacer";
import { RouteName, ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import { SettingMenuItem } from "../components/SettingMenuItems";

const settingScreens: {
  title: string;
  navigateTo: RouteName;
  danger?: boolean;
}[] = [
  {
    title: "Change Password",
    navigateTo: "MiniChangePassword",
  },
  {
    title: "Reveal Seed Phrase",
    navigateTo: "MiniRevealSeedPhrase",
  },
  {
    title: "Export Private Key",
    navigateTo: "MiniExportPrivateKey",
  },
  {
    title: "Security & Privacy",
    navigateTo: "MiniResetWallet",
  },
  {
    title: "Reset Wallet",
    navigateTo: "MiniResetWallet",
    danger: true,
  },
];

export const SecurityAndPrivacy: ScreenFC<"MiniSecurityAndPrivacy"> = ({
  navigation,
}) => {
  const gotoSettings = () => navigation.replace("MiniSettings");
  return (
    <BlurScreenContainer title="Security & Privacy" onGoBack={gotoSettings}>
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        {settingScreens.map((screen) => {
          return (
            <Fragment key={screen.title}>
              <SettingMenuItem
                title={screen.title}
                navigateTo={screen.navigateTo}
                danger={screen?.danger ?? false}
              />
              <SpacerColumn size={1} />
            </Fragment>
          );
        })}
      </View>
    </BlurScreenContainer>
  );
};
