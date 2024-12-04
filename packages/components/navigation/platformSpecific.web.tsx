// axelar libs imported by the bridge screen are breaking the ios CI

import { FC } from "react";

import { getNav } from "./util";

import { useAppConfig } from "@/context/AppConfigProvider";
import { RiotGameBridgeScreen } from "@/screens/RiotGame/RiotGameBridgeScreen";

const { Nav } = getNav("normal");

export const PlatformScreens: FC = () => {
  const { browserTabsPrefix } = useAppConfig();
  const screenTitle = (title: string) => browserTabsPrefix + title;
  return (
    <>
      <Nav.Screen
        name="RiotGameBridge"
        component={RiotGameBridgeScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Bridge"),
        }}
      />
    </>
  );
};
