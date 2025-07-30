import logo from "@/assets/logos/gnotribe-toplogo.svg";
import { AppConfig } from "@/context/AppConfigProvider";
import AppRoot from "@/dapp-root/App";

const config: AppConfig = {
  disableBuyTokensButton: true,
  disableDAppStore: true,
  forceNetworkList: ["gno-zenao", "gno-zenao-staging"],
  forceDAppsList: ["feed", "organizations"],
  defaultNetworkId: "gno-zenao",
  homeScreen: "Feed",
  browserTabsPrefix: "Gnotribe - ",
  logo,
};

export const App: React.FC = () => {
  return <AppRoot config={config} />;
};
