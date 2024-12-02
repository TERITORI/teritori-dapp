import logo from "@/assets/logos/gnotribe-logo.svg";
import { AppConfig } from "@/context/AppConfigProvider";
import AppRoot from "@/dapp-root/App";

const config: AppConfig = {
  disableBuyTokensButton: true,
  disableDAppStore: true,
  forceNetworkList: ["gno-test5", "gno-portal"],
  forceDAppsList: ["feed", "organizations"],
  defaultNetworkId: "gno-test5",
  homeScreen: "Feed",
  logo,
};

export const App: React.FC = () => {
  return <AppRoot config={config} />;
};
