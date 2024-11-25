import { createContext, useContext } from "react";

export interface AppConfig {
  disableBuyTokensButton?: boolean;
  disableDAppStore?: boolean;
  forceNetworkList?: string[];
  forceDAppsList?: string[];
  defaultNetworkId: string;
}
const defaultValue: AppConfig = {
  defaultNetworkId: "teritori",
};

const AppConfigContext = createContext(defaultValue);

export const AppConfigProvider = AppConfigContext.Provider;

export const useAppConfig = () => useContext(AppConfigContext);
