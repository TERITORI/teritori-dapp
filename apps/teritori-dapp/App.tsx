import { AppConfig } from "@/context/AppConfigProvider";
import AppRoot from "@/dapp-root/App";

const config: AppConfig = {};

export const App: React.FC = () => {
  return <AppRoot config={config} />;
};
