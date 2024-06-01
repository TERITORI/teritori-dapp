import { Platform } from "react-native";

import { Sidebar } from "./Sidebar";
import { getMiniModeScreens } from "./getMiniModeScreens";
import { getNormalModeScreens } from "./getNormalModeScreens";
import { getNav } from "./util";

import { useIsMiniMode } from "@/hooks/useAppMode";
import { useOnboardedStatus } from "@/hooks/useOnboardStatus";

export const Navigator: React.FC = () => {
  const isMiniMode = useIsMiniMode();
  const [isLoading] = useOnboardedStatus();

  const { Nav, navigatorScreenOptions } = getNav(isMiniMode);

  if (isLoading && isMiniMode) {
    return null;
  }

  return (
    <Nav.Navigator
      initialRouteName={isMiniMode ? "MiniTabs" : "Home"}
      drawerContent={() =>
        Platform.OS === "web" || isMiniMode ? null : <Sidebar />
      }
      screenOptions={navigatorScreenOptions as any} // FIXME: upgrade to expo-router
    >
      {getNormalModeScreens(isMiniMode)}
      {isMiniMode ? getMiniModeScreens() : null}
    </Nav.Navigator>
  );
};
