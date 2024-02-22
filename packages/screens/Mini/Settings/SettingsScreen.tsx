import React, { Fragment } from "react";
import { View } from "react-native";

import { SettingMenuItem } from "../components/SettingMenuItems";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { SpacerColumn } from "@/components/spacer";
import { RouteName, ScreenFC } from "@/utils/navigation";
import { layout } from "@/utils/style/layout";

const settingScreens: { title: string; navigateTo: RouteName }[] = [
  {
    title: "Connected Apps",
    navigateTo: "MiniSettings",
  },
  {
    title: "Address Book",
    navigateTo: "AddressBook",
  },
  {
    title: "Change Network",
    navigateTo: "ChangeNetwork",
  },
  {
    title: "Security & Privacy",
    navigateTo: "MiniSecurityAndPrivacy",
  },
  {
    title: "Chat Settings",
    navigateTo: "MiniChatSetting",
  },
  {
    title: "Preferences",
    navigateTo: "MiniPreferencesSetting",
  },
  {
    title: "About Teritori",
    navigateTo: "About",
  },
];

export const SettingsScreen: ScreenFC<"MiniSettings"> = ({ navigation }) => {
  return (
    <BlurScreenContainer
      title="Settings"
      onGoBack={() => navigation.replace("MiniProfile")}
    >
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
              />
              <SpacerColumn size={1} />
            </Fragment>
          );
        })}
      </View>
    </BlurScreenContainer>
  );
};
