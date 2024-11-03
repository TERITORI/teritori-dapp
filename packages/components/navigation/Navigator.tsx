import * as Linking from "expo-linking";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";

import { Sidebar } from "./Sidebar";
import { getMiniModeScreens } from "./getMiniModeScreens";
import { getNormalModeScreens } from "./getNormalModeScreens";
import { getNav } from "./util";

import { useAppMode } from "@/hooks/useAppMode";
import { useOnboardedStatus } from "@/hooks/useOnboardStatus";
import { selectContactInfo } from "@/store/slices/message";
import { useAppNavigation } from "@/utils/navigation";
import { AppMode } from "@/utils/types/app-mode";

export const Navigator: React.FC = () => {
  const [appMode] = useAppMode();
  const [isLoading] = useOnboardedStatus();

  const { Nav, navigatorScreenOptions } = getNav(appMode as AppMode);
  const navigation = useAppNavigation();
  const contactInfo = useSelector(selectContactInfo);

  useEffect(() => {
    const handleLinkingUrl = async (url: string) => {
      if (!url) {
        return;
      }

      const isGroupLink = url.includes("/group");
      const isContactLink = url.includes("/contact");

      if (isGroupLink || isContactLink) {
        // waiting for navigation to be mounted before navigation
        setTimeout(() => {
          navigation.navigate("MiniAddFriend", { contactUrl: url });
        }, 1000);
      }
    };

    Linking.getInitialURL()
      .then((initialURL) => {
        if (initialURL) {
          handleLinkingUrl(initialURL);
        }
      })
      .catch((err) => console.log(err));

    const linkingListener = Linking.addEventListener(
      "url",
      (e) => e.url && handleLinkingUrl(e.url),
    );

    return () => {
      linkingListener.remove();
    };
  }, [contactInfo, navigation]);

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
