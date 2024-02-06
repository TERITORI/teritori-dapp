// axelar libs imported by the bridge screen are breaking the ios CI

import { Nav, screenTitle } from "./util";

import { RiotGameBridgeScreen } from "@/screens/RiotGame/RiotGameBridgeScreen";

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
