import { AppConfig } from "@/context/AppConfigProvider";
import AppRoot from "@/dapp-root/App";

const config: AppConfig = {
  defaultNetworkId: "teritori",
  homeScreen: "Home",
};

export const App: React.FC = () => {
  return <AppRoot config={config} />;
};
