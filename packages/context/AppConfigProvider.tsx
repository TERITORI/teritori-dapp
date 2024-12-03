import { createContext, useContext } from "react";
import { SvgProps } from "react-native-svg";

import { RootStackParamList } from "@/utils/navigation";

export interface AppConfig {
  disableBuyTokensButton?: boolean;
  disableDAppStore?: boolean;
  forceNetworkList?: string[];
  forceDAppsList?: string[];
  defaultNetworkId: string;
  homeScreen: keyof RootStackParamList;
  logo?: React.FC<SvgProps>;
}
const defaultValue: AppConfig = {
  defaultNetworkId: "teritori",
  homeScreen: "Home",
};

const AppConfigContext = createContext(defaultValue);

export const AppConfigProvider = AppConfigContext.Provider;

export const useAppConfig = () => useContext(AppConfigContext);
