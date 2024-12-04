// axelar libs imported by the bridge screen are breaking the ios CI

import { getNav } from "./util";

import { RiotGameBridgeScreen } from "@/screens/RiotGame/RiotGameBridgeScreen";

const { Nav } = getNav("normal");

// this can't be a FC because using an intermediary component makes the Navigator crash
export const getPlatformScreens: (
  screenTitle: (title: string) => string,
) => JSX.Element = (screenTitle) => (
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
