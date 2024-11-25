import { createContext, useContext } from "react";

export interface AppConfig {
  disableBuyTokensButton?: boolean;
  disableDAppStore?: boolean;
  alwaysEnableTestnets?: boolean;
}
const defaultValue: AppConfig = {};

const AppConfigContext = createContext(defaultValue);

export const AppConfigProvider = AppConfigContext.Provider;

export const useAppConfig = () => useContext(AppConfigContext);
