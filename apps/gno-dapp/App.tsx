import { AppConfig } from "@/context/AppConfigProvider";
import AppRoot from "@/dapp-root/App";

const config: AppConfig = {
  disableBuyTokensButton: true,
  disableDAppStore: true,
  alwaysEnableTestnets: true,
};

export const App: React.FC = () => {
  return <AppRoot config={config} />;
};
