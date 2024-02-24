import { Platform } from "react-native";

import { Sidebar } from "./Sidebar";
import { getMiniModeScreens } from "./getMiniModeScreens";
import { getNormalModeScreens } from "./getNormalModeScreens";
import { getNav } from "./util";

import { useAppMode } from "@/hooks/useAppMode";
import { useOnboardedStatus } from "@/hooks/useOnboardStatus";
import { AppMode } from "@/utils/types/app-mode";

export const Navigator: React.FC = () => {
  const [appMode] = useAppMode();
  const [isLoading] = useOnboardedStatus();

  const { Nav, navigatorScreenOptions } = getNav(appMode as AppMode);

  if (isLoading && appMode === "mini") {
    return null;
  }

  return (
    <Nav.Navigator
      initialRouteName={appMode === "mini" ? "MiniTabs" : "Home"}
      drawerContent={() =>
        Platform.OS === "web" || appMode === "mini" ? null : <Sidebar />
      }
      screenOptions={navigatorScreenOptions as any} // FIXME: upgrade to expo-router
    >
      {getNormalModeScreens({ appMode: appMode as AppMode })}
      {appMode === "mini" ? getMiniModeScreens() : null}
    </Nav.Navigator>
  );
};
