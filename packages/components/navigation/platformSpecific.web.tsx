// axelar libs imported by the bridge screen are breaking the ios CI

import { getNav, screenTitle } from "./util";

import { RiotGameBridgeScreen } from "@/screens/RiotGame/RiotGameBridgeScreen";

const { Nav } = getNav(false);

export const platformScreens: JSX.Element = (
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
