import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";

import { RootStackParamList } from "@/utils/navigation";
import { neutral00 } from "@/utils/style/colors";
import { fullSidebarWidth } from "@/utils/style/layout";
import { AppMode } from "@/utils/types/app-mode";

export const getNav = (appMode: AppMode) => {
  if (Platform.OS === "web" || appMode === "mini") {
    return {
      Nav: createNativeStackNavigator<RootStackParamList>(),
      navigatorScreenOptions: {},
    };
  } else {
    return {
      Nav: createDrawerNavigator<RootStackParamList>(),
      navigatorScreenOptions: {
        drawerStyle: {
          backgroundColor: neutral00,
          width: fullSidebarWidth,
        },
      },
    };
  }
};
