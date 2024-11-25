import { createContext, useContext } from "react";

import { RootStackParamList } from "@/utils/navigation";

export interface AppConfig {
  disableBuyTokensButton?: boolean;
  disableDAppStore?: boolean;
  forceNetworkList?: string[];
  forceDAppsList?: string[];
  defaultNetworkId: string;
  homeScreen: keyof RootStackParamList;
}
const defaultValue: AppConfig = {
  defaultNetworkId: "teritori",
  homeScreen: "Home",
};

const AppConfigContext = createContext(defaultValue);

export const AppConfigProvider = AppConfigContext.Provider;

export const useAppConfig = () => useContext(AppConfigContext);
