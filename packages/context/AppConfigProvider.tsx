import { createContext, useContext } from "react";

export interface AppConfig {
  disableBuyTokensButton?: boolean;
  disableDAppStore?: boolean;
  forceNetworkList?: string[];
  forceDAppsList?: string[];
}
const defaultValue: AppConfig = {};

const AppConfigContext = createContext(defaultValue);

export const AppConfigProvider = AppConfigContext.Provider;

export const useAppConfig = () => useContext(AppConfigContext);
