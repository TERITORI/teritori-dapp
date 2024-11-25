import { AppConfig } from "@/context/AppConfigProvider";
import AppRoot from "@/dapp-root/App";

const config: AppConfig = {
  defaultNetworkId: "teritori",
};

export const App: React.FC = () => {
  return <AppRoot config={config} />;
};
